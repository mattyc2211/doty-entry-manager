-- ============================================================================
-- The 2026 show.
--
-- A migration rather than a seed file, because for this app the show row is
-- configuration, not test data: without it there is nothing to enter and the
-- site cannot render. `supabase db push` applies migrations and never touches
-- seed.sql, so a seeded show would exist locally and be missing in production,
-- which is the sort of difference you hear about from an exhibitor.
--
-- Guarded with ON CONFLICT so it is safe against a database that already has
-- it. Everything the 2025 build had hardcoded across five source files now
-- lives in these two inserts, and next year is a copy of this block.
--
-- Show date and qualifying period come from the 2026 artwork. Fees and bank
-- details carry over from 2025 unchanged, as instructed.
-- ============================================================================

insert into public.shows (
  year,
  name,
  show_date,
  venue,
  entries_open_at,
  entries_close_at,
  qualification_start,
  qualification_end,
  dinner_ticket_fee,
  extra_catalogue_fee,
  bank_account_name,
  bank_account_number,
  is_active
) values (
  2026,
  'Royal Canin New Zealand Premier Show Dog of the Year',
  '2026-11-28',                                        -- Saturday 28 November 2026
  null,                                                -- venue not yet confirmed
  '2026-02-01 00:00:00 Pacific/Auckland'::timestamptz, -- entries are open
  '2026-11-27 23:59:59 Pacific/Auckland'::timestamptz, -- provisional: eve of the show, to be set properly later
  '2025-10-15',                                        -- qualifying period, from the artwork
  '2026-10-19',
  45.00,                                               -- dinner ticket, unchanged from 2025
  10.00,                                               -- extra catalogue, unchanged from 2025
  'NZ Premier ShowDog of The Year',
  '12-3031-0250030-00',
  true
)
on conflict (year) do nothing;

-- The three competitions. Qualification wording is carried across verbatim from
-- the 2025 build's QUALIFICATION_REQUIREMENTS so nothing is paraphrased by
-- accident: this is the text that decides whether an entry is eligible.
insert into public.show_events (show_id, code, title, requirement, entry_fee, sort_order)
select
  s.id, v.code, v.title, v.requirement, 30.00, v.sort_order
from public.shows s
cross join (values
  (
    'show_dog',
    'Show Dog of the Year',
    'Entrants must have qualified with a ''BEST IN SHOW'' at an All Breeds Championship Show, a Group or Breed Specialty Championship Show or a ''RESERVE BEST IN SHOW'' at an All Breeds Championship Show only.',
    1
  ),
  (
    'puppy',
    'Puppy of the Year',
    'Entrants must have won ''BABY PUPPY IN SHOW'', a ''MINOR PUPPY IN SHOW'' or ''PUPPY IN SHOW'' at an All Breeds Championship, Group or Breed Specialty Show.',
    2
  ),
  (
    'neuter',
    'Neuter of the Year',
    'Entrants must have won ''NEUTER BEST IN SHOW'', a ''NEUTER RESERVE IN SHOW'' at an All Breeds Championship or a ''BEST IN SHOW'' at a Group or Breed Specialty Show.',
    3
  )
) as v(code, title, requirement, sort_order)
where s.year = 2026
on conflict (show_id, code) do nothing;
