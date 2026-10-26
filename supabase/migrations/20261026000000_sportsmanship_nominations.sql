-- ============================================================================
-- Sportsmanship award nominations
--
-- Two awards, North Island and South Island. Anyone can nominate one person
-- for either or both, giving their own name and Dogs NZ member number and an
-- optional short reason. Voting opens once nominations close; that is a later
-- change and nothing here assumes its shape.
--
-- Same principles as the entries:
--   - The public gets no table access. Nominations arrive through
--     submit_nominations() and nowhere else.
--   - Reads are admin-only. A nomination carries the nominator's name and
--     member number, so it is not public.
--   - Open/closed is enforced by the server, not just hidden by the page.
--     There is no close date yet, so it is a switch the organisers flip.
-- ============================================================================

alter table public.shows
  add column nominations_open boolean not null default false;

create table public.nominations (
  id                       uuid primary key default gen_random_uuid(),
  show_id                  uuid not null references public.shows(id),
  award                    text not null
                             check (award in ('north_island', 'south_island')),
  nominee_name             text not null check (length(nominee_name) between 1 and 120),
  reason                   text check (reason is null or length(reason) <= 500),
  nominator_name           text not null check (length(nominator_name) between 1 and 120),
  nominator_member_number  text not null check (length(nominator_member_number) between 1 and 20),
  created_at               timestamptz not null default now(),

  -- One nomination per member per award. Without it a single person could
  -- stack the list, and the shortlist for voting would mean nothing.
  unique (show_id, award, nominator_member_number)
);

create index nominations_show_award_idx on public.nominations (show_id, award);


-- ---------------------------------------------------------------------------
-- submit_nominations: the only way a nomination gets in
--
-- p_nominator: { name, member_number }
-- p_nominations: [ { award, nominee_name, reason } ], one or two items
--
-- Both awards go in one transaction, so a nominator never ends up with one
-- recorded and the other lost.
-- ---------------------------------------------------------------------------
create or replace function public.submit_nominations(
  p_nominator   jsonb,
  p_nominations jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_show    public.shows%rowtype;
  v_item    jsonb;
  v_name    text := trim(coalesce(p_nominator->>'name', ''));
  v_member  text := upper(regexp_replace(coalesce(p_nominator->>'member_number', ''), '\s', '', 'g'));
  v_award   text;
  v_nominee text;
  v_reason  text;
  v_seen    text[] := '{}';
  v_count   integer := 0;
begin
  select * into v_show from public.shows where is_active;

  if not found then
    raise exception 'No show is currently running' using errcode = 'P0002';
  end if;

  if not v_show.nominations_open then
    raise exception 'Nominations are not open at the moment.' using errcode = 'P0001';
  end if;

  if v_name = '' then
    raise exception 'Please give your name.' using errcode = 'P0001';
  end if;

  if v_member = '' then
    raise exception 'Please give your Dogs NZ member number.' using errcode = 'P0001';
  end if;

  if length(v_name) > 120 or length(v_member) > 20 then
    raise exception 'Your name or member number is too long.' using errcode = 'P0001';
  end if;

  if jsonb_typeof(p_nominations) is distinct from 'array'
     or jsonb_array_length(p_nominations) = 0 then
    raise exception 'Nominate someone for at least one award.' using errcode = 'P0001';
  end if;

  if jsonb_array_length(p_nominations) > 2 then
    raise exception 'There are only two awards to nominate for.' using errcode = 'P0001';
  end if;

  for v_item in select * from jsonb_array_elements(p_nominations) loop
    v_award   := v_item->>'award';
    v_nominee := trim(coalesce(v_item->>'nominee_name', ''));
    v_reason  := nullif(trim(coalesce(v_item->>'reason', '')), '');

    if v_award is null or v_award not in ('north_island', 'south_island') then
      raise exception 'Unknown award.' using errcode = 'P0001';
    end if;

    if v_award = any(v_seen) then
      raise exception 'Only one nomination per award.' using errcode = 'P0001';
    end if;
    v_seen := v_seen || v_award;

    if v_nominee = '' then
      raise exception 'Please give the name of the person you are nominating.' using errcode = 'P0001';
    end if;

    if length(v_nominee) > 120 then
      raise exception 'The nominee''s name is too long.' using errcode = 'P0001';
    end if;

    if v_reason is not null and length(v_reason) > 500 then
      raise exception 'Please keep the reason under 500 characters.' using errcode = 'P0001';
    end if;

    begin
      insert into public.nominations (
        show_id, award, nominee_name, reason, nominator_name, nominator_member_number
      ) values (
        v_show.id, v_award, v_nominee, v_reason, v_name, v_member
      );
    exception when unique_violation then
      raise exception 'Member % has already nominated someone for the % award.',
        v_member,
        case v_award when 'north_island' then 'North Island' else 'South Island' end
        using errcode = 'P0001';
    end;

    v_count := v_count + 1;
  end loop;

  return jsonb_build_object('count', v_count);
end;
$$;

revoke all on function public.submit_nominations(jsonb, jsonb) from public;
grant execute on function public.submit_nominations(jsonb, jsonb) to anon, authenticated;


-- ---------------------------------------------------------------------------
-- Row Level Security and privileges
--
-- No public policy and no public grant: anon cannot read or write the table
-- directly in any direction. Organisers can read and remove nominations (to
-- clear a test or a duplicate), but not edit what someone wrote.
-- ---------------------------------------------------------------------------
alter table public.nominations enable row level security;

create policy "Admins can read nominations"
  on public.nominations for select using (public.is_admin());

create policy "Admins can delete nominations"
  on public.nominations for delete using (public.is_admin());

-- The hosted project's default privileges hand anon and authenticated every
-- privilege on a new table (unlike the local stack the baseline was written
-- against), so take them back explicitly rather than relying on RLS alone.
revoke all on public.nominations from anon, authenticated;
grant select, delete on public.nominations to authenticated;
grant all on public.nominations to service_role;
