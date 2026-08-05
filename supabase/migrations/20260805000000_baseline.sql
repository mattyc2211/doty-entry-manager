-- ============================================================================
-- Royal Canin New Zealand Premier Show Dog of the Year
-- Baseline schema for the 2026 rebuild.
--
-- Replaces the seven Lovable migrations, which are not carried across and are
-- not reusable: four of them each ran CREATE TABLE public.admin_users without
-- IF NOT EXISTS, so three of the four always errored. They remain on `main`
-- in git history if they are ever needed for reference.
--
-- Three principles, each fixing something specific in the old build:
--
--   1. The show is data, not source code. Dates, fees and the qualification
--      wording live in `shows` and `show_events`. Running next year's show is
--      a form fill, not an edit across five files. This also retires the
--      hardcoded ENTRY_STATUS.isOpen = true, which left the 2025 form
--      accepting entries and bank transfers long after the show closed:
--      open/closed is now derived from dates and enforced server-side.
--
--   2. The public role gets no table access at all. Entries arrive through
--      create_entry(), which prices them from `show_events` on the server.
--      The old build calculated the total in the browser and inserted it as
--      given, so anyone could record an entry owing nothing.
--
--   3. Reads are admin-only. The old build granted SELECT on every entry
--      table to everyone, exposing exhibitor names, emails and phone numbers
--      to any caller holding the anon key, which ships in the JS bundle.
-- ============================================================================


-- ---------------------------------------------------------------------------
-- Admins
--
-- A table rather than a check on auth.role(), because Supabase projects allow
-- public signup by default. Without this, anyone who signed up would satisfy
-- `authenticated` and read every entry. Membership here is the gate; turning
-- signup off in project settings is the belt to this pair of braces.
-- ---------------------------------------------------------------------------
create table public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  created_at timestamptz not null default now()
);

-- SECURITY DEFINER, so it bypasses RLS on public.admins. That is what stops
-- the policy on `admins` from recursing into itself.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;


-- ---------------------------------------------------------------------------
-- The show
-- ---------------------------------------------------------------------------
create table public.shows (
  id                    uuid primary key default gen_random_uuid(),
  year                  integer not null unique,
  name                  text not null,
  show_date             date not null,
  venue                 text,

  entries_open_at       timestamptz not null,
  entries_close_at      timestamptz not null,
  qualification_start   date not null,
  qualification_end     date not null,

  dinner_ticket_fee     numeric(10,2) not null,
  extra_catalogue_fee   numeric(10,2) not null,

  bank_account_name     text not null,
  bank_account_number   text not null,

  is_active             boolean not null default false,

  -- Bumped under a row lock by create_entry(), so two simultaneous entries
  -- cannot be handed the same reference. The old build derived its reference
  -- from the last six digits of the clock, which recur every 16.7 minutes and
  -- collide against a UNIQUE constraint, losing a fully completed entry.
  next_entry_number     integer not null default 1,

  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),

  constraint shows_entry_window_valid
    check (entries_close_at > entries_open_at),
  constraint shows_qualification_window_valid
    check (qualification_end > qualification_start)
);

-- At most one active show. Enforced here rather than trusted to admin care.
create unique index shows_one_active on public.shows (is_active) where is_active;


-- The three competitions. Held per show so the wording, the fee and even the
-- line-up can change year to year without touching the code.
create table public.show_events (
  id          uuid primary key default gen_random_uuid(),
  show_id     uuid not null references public.shows(id) on delete cascade,
  code        text not null,
  title       text not null,
  requirement text not null,
  entry_fee   numeric(10,2) not null check (entry_fee >= 0),
  sort_order  integer not null default 0,
  unique (show_id, code)
);


-- ---------------------------------------------------------------------------
-- Entries
-- ---------------------------------------------------------------------------
create table public.submissions (
  id                   uuid primary key default gen_random_uuid(),
  show_id              uuid not null references public.shows(id),

  entry_number         integer not null,
  reference            text not null unique,

  exhibitor_first_name text not null,
  exhibitor_surname    text not null,
  exhibitor_email      text not null,
  exhibitor_phone      text not null,

  dinner_tickets       integer not null default 0 check (dinner_tickets >= 0),
  extra_catalogues     integer not null default 0 check (extra_catalogues >= 0),
  dietary_requirements text,

  -- Priced by create_entry(). Never accepted from the client.
  total_amount         numeric(10,2) not null check (total_amount >= 0),

  -- Bank transfer reconciliation. There was no payment tracking of any kind in
  -- the old build: matching money to entries happened entirely outside the app.
  payment_status       text not null default 'unpaid'
                         check (payment_status in ('unpaid', 'paid', 'waived')),
  paid_at              timestamptz,
  payment_note         text,

  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),

  unique (show_id, entry_number)
);

create table public.dog_entries (
  id                   uuid primary key default gen_random_uuid(),
  submission_id        uuid not null references public.submissions(id) on delete cascade,
  pedigree_name        text not null,
  dogs_nz_registration text not null,
  breed                text not null,
  photo_url            text,
  created_at           timestamptz not null default now()
);

create table public.event_entries (
  id              uuid primary key default gen_random_uuid(),
  dog_entry_id    uuid not null references public.dog_entries(id) on delete cascade,
  show_event_id   uuid not null references public.show_events(id),
  qualifying_show text not null,
  qualifying_date date not null,

  -- The fee as it stood when the entry was made, so a later price change does
  -- not silently rewrite what someone was asked to pay.
  fee_charged     numeric(10,2) not null,

  created_at      timestamptz not null default now(),
  unique (dog_entry_id, show_event_id)
);

create index submissions_show_created_idx on public.submissions (show_id, created_at desc);
create index submissions_payment_status_idx on public.submissions (show_id, payment_status);
create index dog_entries_submission_idx on public.dog_entries (submission_id);
create index event_entries_dog_idx on public.event_entries (dog_entry_id);


-- ---------------------------------------------------------------------------
-- updated_at
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger shows_set_updated_at
  before update on public.shows
  for each row execute function public.set_updated_at();

create trigger submissions_set_updated_at
  before update on public.submissions
  for each row execute function public.set_updated_at();


-- ---------------------------------------------------------------------------
-- create_entry: the only way an entry gets in
--
-- Does in one transaction what the old client did in three round trips, which
-- also fixes a quieter bug: if the dog insert failed halfway, the old flow left
-- an orphaned submission behind and the exhibitor saw an error.
-- ---------------------------------------------------------------------------
create or replace function public.create_entry(
  p_exhibitor jsonb,
  p_dogs      jsonb default '[]'::jsonb,
  p_catering  jsonb default '{}'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_show          public.shows%rowtype;
  v_show_event    public.show_events%rowtype;
  v_dog           jsonb;
  v_event         jsonb;
  v_dog_id        uuid;
  v_submission_id uuid;
  v_entry_number  integer;
  v_reference     text;
  v_total         numeric(10,2) := 0;
  v_qual_date     date;
  v_dinner        integer := coalesce((p_catering->>'dinner_tickets')::integer, 0);
  v_catalogues    integer := coalesce((p_catering->>'extra_catalogues')::integer, 0);
begin
  -- FOR UPDATE: reads the fees and reserves the entry number under one lock.
  select * into v_show from public.shows where is_active for update;

  if not found then
    raise exception 'No show is currently open for entries'
      using errcode = 'P0002';
  end if;

  if now() < v_show.entries_open_at then
    raise exception 'Entries for % do not open until %',
      v_show.name, to_char(v_show.entries_open_at, 'DD Mon YYYY')
      using errcode = 'P0001';
  end if;

  if now() > v_show.entries_close_at then
    raise exception 'Entries for % closed on %',
      v_show.name, to_char(v_show.entries_close_at, 'DD Mon YYYY')
      using errcode = 'P0001';
  end if;

  if coalesce(trim(p_exhibitor->>'first_name'), '') = ''
     or coalesce(trim(p_exhibitor->>'surname'), '') = ''
     or coalesce(trim(p_exhibitor->>'email'), '') = ''
     or coalesce(trim(p_exhibitor->>'phone'), '') = '' then
    raise exception 'Exhibitor name, email and phone are all required'
      using errcode = 'P0001';
  end if;

  -- Catering-only entries are a supported path, so dogs may be empty. What is
  -- not supported is an entry that orders nothing at all.
  if jsonb_array_length(coalesce(p_dogs, '[]'::jsonb)) = 0
     and v_dinner = 0 and v_catalogues = 0 then
    raise exception 'An entry needs at least one dog, or at least one dinner ticket or catalogue'
      using errcode = 'P0001';
  end if;

  v_entry_number := v_show.next_entry_number;
  update public.shows
     set next_entry_number = next_entry_number + 1
   where id = v_show.id;

  v_reference := 'DOTY' || right(v_show.year::text, 2)
                 || '-' || lpad(v_entry_number::text, 4, '0');

  insert into public.submissions (
    show_id, entry_number, reference,
    exhibitor_first_name, exhibitor_surname, exhibitor_email, exhibitor_phone,
    dinner_tickets, extra_catalogues, dietary_requirements,
    total_amount
  ) values (
    v_show.id, v_entry_number, v_reference,
    trim(p_exhibitor->>'first_name'), trim(p_exhibitor->>'surname'),
    lower(trim(p_exhibitor->>'email')), trim(p_exhibitor->>'phone'),
    v_dinner, v_catalogues, nullif(trim(coalesce(p_catering->>'dietary_requirements', '')), ''),
    0
  )
  returning id into v_submission_id;

  for v_dog in select * from jsonb_array_elements(coalesce(p_dogs, '[]'::jsonb))
  loop
    if coalesce(trim(v_dog->>'pedigree_name'), '') = ''
       or coalesce(trim(v_dog->>'dogs_nz_registration'), '') = ''
       or coalesce(trim(v_dog->>'breed'), '') = '' then
      raise exception 'Each dog needs a pedigree name, a Dogs NZ registration and a breed'
        using errcode = 'P0001';
    end if;

    if jsonb_array_length(coalesce(v_dog->'events', '[]'::jsonb)) = 0 then
      raise exception 'Dog % is not entered in any event', v_dog->>'pedigree_name'
        using errcode = 'P0001';
    end if;

    insert into public.dog_entries (
      submission_id, pedigree_name, dogs_nz_registration, breed, photo_url
    ) values (
      v_submission_id, trim(v_dog->>'pedigree_name'),
      trim(v_dog->>'dogs_nz_registration'), trim(v_dog->>'breed'),
      nullif(trim(coalesce(v_dog->>'photo_url', '')), '')
    )
    returning id into v_dog_id;

    for v_event in select * from jsonb_array_elements(v_dog->'events')
    loop
      select * into v_show_event
        from public.show_events
       where show_id = v_show.id
         and code = v_event->>'event_code';

      if not found then
        raise exception 'Unknown event "%"', v_event->>'event_code'
          using errcode = 'P0001';
      end if;

      v_qual_date := (v_event->>'qualifying_date')::date;

      -- The show's own rule, enforced rather than described. The old build
      -- printed the qualifying period on screen and accepted any date.
      if v_qual_date < v_show.qualification_start
         or v_qual_date > v_show.qualification_end then
        raise exception
          'Qualifying date % for % falls outside the qualifying period (% to %)',
          to_char(v_qual_date, 'DD Mon YYYY'),
          v_dog->>'pedigree_name',
          to_char(v_show.qualification_start, 'DD Mon YYYY'),
          to_char(v_show.qualification_end, 'DD Mon YYYY')
          using errcode = 'P0001';
      end if;

      insert into public.event_entries (
        dog_entry_id, show_event_id, qualifying_show, qualifying_date, fee_charged
      ) values (
        v_dog_id, v_show_event.id,
        trim(v_event->>'qualifying_show'), v_qual_date, v_show_event.entry_fee
      );

      v_total := v_total + v_show_event.entry_fee;
    end loop;
  end loop;

  v_total := v_total
             + (v_dinner * v_show.dinner_ticket_fee)
             + (v_catalogues * v_show.extra_catalogue_fee);

  update public.submissions
     set total_amount = v_total
   where id = v_submission_id;

  return jsonb_build_object(
    'reference',    v_reference,
    'total_amount', v_total
  );
end;
$$;

revoke all on function public.create_entry(jsonb, jsonb, jsonb) from public;
grant execute on function public.create_entry(jsonb, jsonb, jsonb) to anon, authenticated;


-- ---------------------------------------------------------------------------
-- Row Level Security
--
-- Note what is absent: there is no public SELECT anywhere on the entry tables,
-- and no public INSERT either. create_entry() is SECURITY DEFINER, so it writes
-- past RLS; nothing else can.
-- ---------------------------------------------------------------------------
alter table public.admins        enable row level security;
alter table public.shows         enable row level security;
alter table public.show_events   enable row level security;
alter table public.submissions   enable row level security;
alter table public.dog_entries   enable row level security;
alter table public.event_entries enable row level security;

create policy "Admins are visible to admins"
  on public.admins for select using (public.is_admin());

-- The entry form needs the active show's dates and fees to render. This is
-- event configuration, not anyone's personal data.
create policy "Anyone can read the active show"
  on public.shows for select using (is_active);

create policy "Admins can read every show"
  on public.shows for select using (public.is_admin());

create policy "Admins can manage shows"
  on public.shows for all using (public.is_admin()) with check (public.is_admin());

create policy "Anyone can read the active show's events"
  on public.show_events for select
  using (exists (select 1 from public.shows s where s.id = show_id and s.is_active));

create policy "Admins can manage show events"
  on public.show_events for all using (public.is_admin()) with check (public.is_admin());

create policy "Admins can read entries"
  on public.submissions for select using (public.is_admin());

create policy "Admins can update entries"
  on public.submissions for update using (public.is_admin()) with check (public.is_admin());

create policy "Admins can delete entries"
  on public.submissions for delete using (public.is_admin());

create policy "Admins can read dog entries"
  on public.dog_entries for select using (public.is_admin());

create policy "Admins can manage dog entries"
  on public.dog_entries for all using (public.is_admin()) with check (public.is_admin());

create policy "Admins can read event entries"
  on public.event_entries for select using (public.is_admin());

create policy "Admins can manage event entries"
  on public.event_entries for all using (public.is_admin()) with check (public.is_admin());


-- ---------------------------------------------------------------------------
-- Table privileges
--
-- RLS narrows what a role may reach. It cannot hand a role access it was never
-- granted. Supabase's defaults give anon and authenticated only REFERENCES,
-- TRIGGER and TRUNCATE on newly created tables, so without this block every
-- policy above is unreachable: the entry form cannot read the show, and the
-- admin dashboard cannot read entries. Both fail with "permission denied for
-- table ..." rather than an empty result, which is a confusing way to find out.
--
-- anon gets exactly two reads, the show and its events, because the entry form
-- needs the dates and fees to render. It gets nothing on any entry table in any
-- direction. Entries go in through create_entry() and nowhere else.
-- ---------------------------------------------------------------------------
grant usage on schema public to anon, authenticated;

grant select on public.shows        to anon, authenticated;
grant select on public.show_events  to anon, authenticated;

grant insert, update, delete on public.shows          to authenticated;
grant insert, update, delete on public.show_events    to authenticated;
grant select, update, delete on public.submissions    to authenticated;
grant select, insert, update, delete on public.dog_entries   to authenticated;
grant select, insert, update, delete on public.event_entries to authenticated;
grant select on public.admins to authenticated;

-- service_role bypasses RLS. It is a server-side key and must never be put in
-- a browser bundle or a VITE_ variable.
grant all on all tables in schema public to service_role;


-- ---------------------------------------------------------------------------
-- Storage: dog photos
--
-- Kept publicly readable on purpose. These are show dog photographs headed for
-- a printed catalogue, so they are not the sensitive part of an entry. What is
-- removed is the old build's public UPDATE and DELETE, which let any visitor
-- overwrite or erase every exhibitor's photo.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('dog-photos', 'dog-photos', true)
on conflict (id) do nothing;

create policy "Anyone can view dog photos"
  on storage.objects for select using (bucket_id = 'dog-photos');

create policy "Anyone can upload a dog photo"
  on storage.objects for insert with check (bucket_id = 'dog-photos');

create policy "Only admins can replace dog photos"
  on storage.objects for update
  using (bucket_id = 'dog-photos' and public.is_admin());

create policy "Only admins can delete dog photos"
  on storage.objects for delete
  using (bucket_id = 'dog-photos' and public.is_admin());
