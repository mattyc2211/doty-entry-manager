# Schema verification

Twenty checks against the baseline schema. Every one raises on failure, so a
run that reaches `ALL CHECKS PASSED` means all of them held.

They are plain SQL rather than a test framework on purpose: what is being
tested is database behaviour (row level security, grants, constraints, the
`create_entry` transaction), and the honest way to test that is from inside
the database as the roles that will really be calling it.

## Running them

Needs the local stack up. Ports are in the 547xx block, set in
`supabase/config.toml`, because this machine runs several other Supabase
projects locally.

```sh
supabase start
supabase db reset          # applies the migration, then seed.sql

docker exec -i supabase_db_doty-entry-manager \
  psql -U postgres -d postgres -q -v ON_ERROR_STOP=1 < supabase/tests/01-entries.sql

docker exec -i supabase_db_doty-entry-manager \
  psql -U postgres -d postgres -q -v ON_ERROR_STOP=1 < supabase/tests/02-admin-gate.sql
```

Run `supabase db reset` before each pass. The scripts insert data and do not
clean up after themselves, and several checks assert exact row counts.

## What they cover, and why those things

`01-entries.sql` covers entry submission:

- pricing is done by the server, not accepted from the client
- references increment per show instead of being derived from the clock
- a rejected entry leaves nothing behind
- qualifying dates are enforced against the show's own period
- entries stop when the show closes
- **anon can actually lodge an entry** (the rest runs as `postgres`, which
  proves the logic but not that a real visitor can reach it)
- anon cannot read a single entry, write to any entry table, or alter the fees

`02-admin-gate.sql` covers the admin gate, from both sides:

- a signed-in user who is not in `public.admins` sees nothing and can change
  nothing, which is the half that is easy to forget to test
- an admin sees everything and can mark an entry paid
- `payment_status` is constrained, so a typo cannot invent a state that the
  unpaid list then quietly skips

Each of these maps to something that was wrong in the 2025 build. The totals
were computed in the browser and stored as sent. References came from the last
six digits of the epoch millisecond, which recur every 16.7 minutes against a
`UNIQUE` constraint. `isOpen` was hardcoded `true`. Admin was a localStorage
key checked in the browser, over tables that granted `SELECT` to everyone.

## One thing worth knowing

`create_entry` takes a row lock on the active show to allocate the reference,
so entries are serialised. At a few hundred entries a year that is irrelevant,
and it is what makes duplicate references impossible. It would matter if this
ever had to take thousands of entries at once, which it does not.
