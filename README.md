# Royal Canin New Zealand Premier Show Dog of the Year

Entry system for the show. Exhibitors lodge an entry, pay by bank transfer using
the reference they are given, and the organisers reconcile payments in an admin
dashboard.

Originally built in Lovable in 2025 and rebuilt in 2026: same show, new code.

## What it does

- **The show is data.** Dates, fees, the bank account and the qualification
  wording live in the `shows` and `show_events` tables. Running next year's show
  is an insert, not a code change. The 2025 build had these hardcoded across five
  source files, and its commit history is mostly edits to them.
- **Entries are claims of qualification.** You cannot buy your way in. Every dog
  must have won Best in Show (or the equivalent for its title) inside a fixed
  qualifying period, and the entry names the show and the date. The database
  enforces the period rather than just printing it.
- **The server prices the entry.** `create_entry()` computes the total from the
  show's own fees inside one transaction. The browser never states what it owes.
- **Payment references are sequential per show** (`DOTY26-0042`) and allocated
  under a row lock, so two entries cannot be given the same one.

## Stack

Vite, React 18, TypeScript, Tailwind and shadcn/ui, on Supabase (Postgres, Auth
and Storage). Hosted as a static site on AWS Amplify. There is no server of our
own: the browser talks to Supabase directly, and row level security is what
enforces access.

## Running it locally

```sh
npm install
supabase start          # ports are in the 547xx block, see supabase/config.toml
supabase db reset       # applies the migrations, including the 2026 show
cp .env.example .env    # then fill in from `supabase status`
npm run dev             # http://localhost:8080
```

To sign in to `/admin` locally, create an organiser account:

```sh
node scripts/create-organiser.mjs \
  --url http://127.0.0.1:54721 \
  --key <local service_role key from `supabase status`> \
  --email you@example.com \
  --password somethinglongenough
```

## Verifying it

There are no unit tests. What matters here is database behaviour, so it is
tested from inside the database as the roles that really call it, plus two
scripts that exercise the same path a browser takes.

```sh
# 20 checks: RLS, grants, pricing, references, the admin gate. Reset first.
supabase db reset
docker exec -i supabase_db_doty-entry-manager psql -U postgres -d postgres \
  -q -v ON_ERROR_STOP=1 < supabase/tests/01-entries.sql
docker exec -i supabase_db_doty-entry-manager psql -U postgres -d postgres \
  -q -v ON_ERROR_STOP=1 < supabase/tests/02-admin-gate.sql

# End to end through PostgREST as anon, against whatever .env points at.
node scripts/smoke.mjs

# Read-only check of a deployed project. Safe against production.
node scripts/verify-remote.mjs --url <project url> --key <anon key>
```

See `supabase/tests/README.md` for what each check covers and why.

## Layout

```
supabase/migrations/   schema, then the 2026 show as configuration
supabase/tests/        SQL verification, with notes on what each check is for
scripts/               env guard, organiser creation, smoke and remote checks
src/lib/               show config, entry submission, admin queries, formatting
src/components/entry/  the entry flow
src/components/admin/  login and reconciliation dashboard
src/components/show/   shared show furniture, including the ring card
```

## Deploying

See [DEPLOY.md](DEPLOY.md). The one step that will break the site if skipped is
the SPA rewrite rule: without it every route except `/` returns 404 on a direct
visit.
