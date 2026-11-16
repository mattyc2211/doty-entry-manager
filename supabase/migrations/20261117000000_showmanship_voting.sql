-- ============================================================================
-- Showmanship award voting
--
-- Nominations produced a shortlist for each award; members now vote from it.
-- The ballot is a fixed list (ballot_candidates), so votes count against a
-- known person instead of free-typed names that need merging by hand.
--
-- Same principles as the nominations:
--   - The public gets no table access. The ballot is read through get_ballot()
--     and votes arrive through submit_votes() and nowhere else.
--   - One vote per Dogs NZ member number per award, enforced by a unique
--     constraint, not by the page.
--   - Open/closed is a switch the organisers flip, enforced by the server.
--   - Votes carry the voter's name and member number, so reads are admin-only.
-- ============================================================================

alter table public.shows
  add column voting_open boolean not null default false;

create table public.ballot_candidates (
  id          uuid primary key default gen_random_uuid(),
  show_id     uuid not null references public.shows(id),
  award       text not null check (award in ('north_island', 'south_island')),
  name        text not null check (length(name) between 1 and 120),
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  unique (show_id, award, name)
);

create table public.votes (
  id                   uuid primary key default gen_random_uuid(),
  show_id              uuid not null references public.shows(id),
  award                text not null check (award in ('north_island', 'south_island')),
  candidate_id         uuid not null references public.ballot_candidates(id),
  voter_name           text not null check (length(voter_name) between 1 and 120),
  voter_member_number  text not null check (length(voter_member_number) between 1 and 20),
  created_at           timestamptz not null default now(),

  -- One vote per member per award.
  unique (show_id, award, voter_member_number)
);

create index votes_candidate_idx on public.votes (candidate_id);


-- ---------------------------------------------------------------------------
-- get_ballot: the candidates for the active show, plus whether voting is open
-- ---------------------------------------------------------------------------
create or replace function public.get_ballot()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'open', s.voting_open,
    'show_date', s.show_date,
    'candidates', coalesce((
      select jsonb_agg(jsonb_build_object('id', c.id, 'award', c.award, 'name', c.name)
                       order by c.award, c.sort_order, c.name)
      from public.ballot_candidates c
      where c.show_id = s.id
    ), '[]'::jsonb)
  )
  from public.shows s
  where s.is_active;
$$;

revoke all on function public.get_ballot() from public;
grant execute on function public.get_ballot() to anon, authenticated;


-- ---------------------------------------------------------------------------
-- submit_votes: the only way a vote gets in
--
-- p_voter: { name, member_number }
-- p_votes: [ { award, candidate_id } ], one or two items
--
-- Both awards go in one transaction: if either is refused, neither is kept.
-- ---------------------------------------------------------------------------
create or replace function public.submit_votes(
  p_voter jsonb,
  p_votes jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_show      public.shows%rowtype;
  v_item      jsonb;
  v_name      text := trim(coalesce(p_voter->>'name', ''));
  v_member    text := upper(regexp_replace(coalesce(p_voter->>'member_number', ''), '\s', '', 'g'));
  v_award     text;
  v_candidate uuid;
  v_seen      text[] := '{}';
  v_count     integer := 0;
begin
  select * into v_show from public.shows where is_active;

  if not found then
    raise exception 'No show is currently running' using errcode = 'P0002';
  end if;

  if not v_show.voting_open then
    raise exception 'Voting is not open at the moment.' using errcode = 'P0001';
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

  if jsonb_typeof(p_votes) is distinct from 'array'
     or jsonb_array_length(p_votes) = 0 then
    raise exception 'Choose someone for at least one award.' using errcode = 'P0001';
  end if;

  if jsonb_array_length(p_votes) > 2 then
    raise exception 'There are only two awards to vote for.' using errcode = 'P0001';
  end if;

  for v_item in select * from jsonb_array_elements(p_votes) loop
    v_award := v_item->>'award';

    if v_award is null or v_award not in ('north_island', 'south_island') then
      raise exception 'Unknown award.' using errcode = 'P0001';
    end if;

    if v_award = any(v_seen) then
      raise exception 'Only one vote per award.' using errcode = 'P0001';
    end if;
    v_seen := v_seen || v_award;

    begin
      v_candidate := (v_item->>'candidate_id')::uuid;
    exception when others then
      raise exception 'That person is not on the ballot.' using errcode = 'P0001';
    end;

    if not exists (
      select 1 from public.ballot_candidates
      where id = v_candidate and show_id = v_show.id and award = v_award
    ) then
      raise exception 'That person is not on the ballot.' using errcode = 'P0001';
    end if;

    begin
      insert into public.votes (show_id, award, candidate_id, voter_name, voter_member_number)
      values (v_show.id, v_award, v_candidate, v_name, v_member);
    exception when unique_violation then
      raise exception 'Member % has already voted for the % award.',
        v_member,
        case v_award when 'north_island' then 'North Island' else 'South Island' end
        using errcode = 'P0001';
    end;

    v_count := v_count + 1;
  end loop;

  return jsonb_build_object('count', v_count);
end;
$$;

revoke all on function public.submit_votes(jsonb, jsonb) from public;
grant execute on function public.submit_votes(jsonb, jsonb) to anon, authenticated;


-- ---------------------------------------------------------------------------
-- Row Level Security and privileges
--
-- Organisers can read both tables and remove a vote (a test, or one cast
-- under a made-up member number). Nobody edits a vote.
-- ---------------------------------------------------------------------------
alter table public.ballot_candidates enable row level security;
alter table public.votes enable row level security;

create policy "Admins can read candidates"
  on public.ballot_candidates for select using (public.is_admin());

create policy "Admins can read votes"
  on public.votes for select using (public.is_admin());

create policy "Admins can delete votes"
  on public.votes for delete using (public.is_admin());

-- The hosted project's default privileges hand anon and authenticated every
-- privilege on a new table, so take them back explicitly.
revoke all on public.ballot_candidates from anon, authenticated;
revoke all on public.votes from anon, authenticated;
grant select on public.ballot_candidates to authenticated;
grant select, delete on public.votes to authenticated;
grant all on public.ballot_candidates to service_role;
grant all on public.votes to service_role;

-- Same trap for functions: default privileges give anon EXECUTE on new
-- functions, so the revoke above from public is not enough on its own.
revoke execute on function public.get_ballot() from anon, authenticated;
revoke execute on function public.submit_votes(jsonb, jsonb) from anon, authenticated;
grant execute on function public.get_ballot() to anon, authenticated;
grant execute on function public.submit_votes(jsonb, jsonb) to anon, authenticated;


-- ---------------------------------------------------------------------------
-- The 2026 ballot, from the nominations as they stood on 17 Nov 2026.
-- Spellings merged: "Hun Tayson" is Hun Taylor, "Lockie Masden" is Lockie
-- Marden. Ordered by surname.
-- ---------------------------------------------------------------------------
insert into public.ballot_candidates (show_id, award, name, sort_order)
select s.id, c.award, c.name, c.sort_order
from public.shows s
cross join (values
  ('north_island', 'Kelly Bennett',          1),
  ('north_island', 'Elay Brandt',            2),
  ('north_island', 'Kelly Clement',          3),
  ('north_island', 'Meg Hamilton',           4),
  ('north_island', 'Archie Hyde',            5),
  ('north_island', 'Emmy Hyde',              6),
  ('north_island', 'Giselle Jeannes',        7),
  ('north_island', 'Janet Jenkins-Piggott',  8),
  ('north_island', 'Mark Jorey',             9),
  ('north_island', 'Alysha Judson',         10),
  ('north_island', 'Paige Judson',          11),
  ('north_island', 'Richard King',          12),
  ('north_island', 'Ken Landon',            13),
  ('north_island', 'Craig Roycroft',        14),
  ('north_island', 'Lori Ryan',             15),
  ('north_island', 'Madison Slater',        16),
  ('north_island', 'Hun Taylor',            17),
  ('south_island', 'Alanya Caldwell',        1),
  ('south_island', 'Emma Case',              2),
  ('south_island', 'Anne Deery',             3),
  ('south_island', 'Kirsty Hubbard',         4),
  ('south_island', 'Carolyn Lewis',          5),
  ('south_island', 'Lockie Marden',          6),
  ('south_island', 'Lauren Morris',          7)
) as c(award, name, sort_order)
where s.year = 2026
on conflict (show_id, award, name) do nothing;
