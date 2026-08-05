-- Verification for the Doty baseline schema.
-- Every check raises on failure, so a clean run to the end means all passed.

\set ON_ERROR_STOP on

do $$
declare
  r        jsonb;
  v_total  numeric;
  v_msg    text;
begin
  -- ---------------------------------------------------------------------
  -- 1. A normal entry: 1 dog in 2 events, 2 dinner tickets, 1 catalogue.
  --    Expected: (2 x 30) + (2 x 45) + (1 x 10) = 160.00
  -- ---------------------------------------------------------------------
  r := public.create_entry(
    '{"first_name":"Jane","surname":"Doe","email":"JANE@Example.COM ","phone":"021 555 0100"}'::jsonb,
    '[{"pedigree_name":"Ch Silverwood Northern Light","dogs_nz_registration":"01234-2024","breed":"Siberian Husky",
       "events":[
         {"event_code":"show_dog","qualifying_show":"Auckland All Breeds","qualifying_date":"2026-03-14"},
         {"event_code":"neuter","qualifying_show":"Waikato Championship","qualifying_date":"2026-05-02"}
       ]}]'::jsonb,
    '{"dinner_tickets":2,"extra_catalogues":1,"dietary_requirements":"One gluten free"}'::jsonb
  );

  if (r->>'reference') <> 'DOTY26-0001' then
    raise exception 'FAIL 1a: expected DOTY26-0001, got %', r->>'reference';
  end if;
  if (r->>'total_amount')::numeric <> 160.00 then
    raise exception 'FAIL 1b: expected 160.00, got %', r->>'total_amount';
  end if;
  raise notice 'PASS 1: normal entry -> % at $%', r->>'reference', r->>'total_amount';

  select total_amount into v_total from public.submissions where reference = 'DOTY26-0001';
  if v_total <> 160.00 then
    raise exception 'FAIL 1c: stored total is %, expected 160.00', v_total;
  end if;

  if (select exhibitor_email from public.submissions where reference = 'DOTY26-0001') <> 'jane@example.com' then
    raise exception 'FAIL 1d: email was not normalised';
  end if;
  raise notice 'PASS 1c/1d: total stored server-side, email normalised';

  -- ---------------------------------------------------------------------
  -- 2. References increment rather than collide.
  -- ---------------------------------------------------------------------
  r := public.create_entry(
    '{"first_name":"Sam","surname":"Patel","email":"sam@example.com","phone":"021 555 0101"}'::jsonb,
    '[{"pedigree_name":"Ch Brightwater Fanfare","dogs_nz_registration":"05678-2025","breed":"Border Collie",
       "events":[{"event_code":"puppy","qualifying_show":"Canterbury Specialty","qualifying_date":"2025-11-30"}]}]'::jsonb,
    '{}'::jsonb
  );
  if (r->>'reference') <> 'DOTY26-0002' then
    raise exception 'FAIL 2: expected DOTY26-0002, got %', r->>'reference';
  end if;
  if (r->>'total_amount')::numeric <> 30.00 then
    raise exception 'FAIL 2b: expected 30.00, got %', r->>'total_amount';
  end if;
  raise notice 'PASS 2: sequential reference -> %', r->>'reference';

  -- ---------------------------------------------------------------------
  -- 3. Catering-only entry (no dogs) is allowed.
  -- ---------------------------------------------------------------------
  r := public.create_entry(
    '{"first_name":"Ana","surname":"Rossi","email":"ana@example.com","phone":"021 555 0102"}'::jsonb,
    '[]'::jsonb,
    '{"dinner_tickets":3,"extra_catalogues":0}'::jsonb
  );
  if (r->>'total_amount')::numeric <> 135.00 then
    raise exception 'FAIL 3: expected 135.00, got %', r->>'total_amount';
  end if;
  raise notice 'PASS 3: catering-only entry -> $%', r->>'total_amount';

  -- ---------------------------------------------------------------------
  -- 4. A qualifying date outside the period is refused (15 Oct 25 to 19 Oct 26).
  -- ---------------------------------------------------------------------
  begin
    r := public.create_entry(
      '{"first_name":"Too","surname":"Early","email":"early@example.com","phone":"021 555 0103"}'::jsonb,
      '[{"pedigree_name":"Ch Out Of Window","dogs_nz_registration":"09999-2023","breed":"Pug",
         "events":[{"event_code":"show_dog","qualifying_show":"Old Show","qualifying_date":"2025-06-01"}]}]'::jsonb,
      '{}'::jsonb
    );
    raise exception 'FAIL 4: an out-of-period qualifying date was accepted';
  exception when sqlstate 'P0001' then
    get stacked diagnostics v_msg = message_text;
    if v_msg not like '%qualifying period%' then raise; end if;
    raise notice 'PASS 4: out-of-period date refused (%)', v_msg;
  end;

  -- ---------------------------------------------------------------------
  -- 5. An unknown event code is refused.
  -- ---------------------------------------------------------------------
  begin
    r := public.create_entry(
      '{"first_name":"Bad","surname":"Event","email":"bad@example.com","phone":"021 555 0104"}'::jsonb,
      '[{"pedigree_name":"Ch Nonexistent","dogs_nz_registration":"08888-2024","breed":"Beagle",
         "events":[{"event_code":"veteran","qualifying_show":"Some Show","qualifying_date":"2026-01-10"}]}]'::jsonb,
      '{}'::jsonb
    );
    raise exception 'FAIL 5: an unknown event code was accepted';
  exception when sqlstate 'P0001' then
    get stacked diagnostics v_msg = message_text;
    if v_msg not like '%Unknown event%' then raise; end if;
    raise notice 'PASS 5: unknown event refused';
  end;

  -- ---------------------------------------------------------------------
  -- 6. An entry ordering nothing at all is refused.
  -- ---------------------------------------------------------------------
  begin
    r := public.create_entry(
      '{"first_name":"Empty","surname":"Order","email":"empty@example.com","phone":"021 555 0105"}'::jsonb,
      '[]'::jsonb, '{}'::jsonb
    );
    raise exception 'FAIL 6: an empty entry was accepted';
  exception when sqlstate 'P0001' then
    raise notice 'PASS 6: empty entry refused';
  end;

  -- ---------------------------------------------------------------------
  -- 7. A dog entered in no events is refused.
  -- ---------------------------------------------------------------------
  begin
    r := public.create_entry(
      '{"first_name":"No","surname":"Events","email":"noevents@example.com","phone":"021 555 0106"}'::jsonb,
      '[{"pedigree_name":"Ch Unentered","dogs_nz_registration":"07777-2024","breed":"Boxer","events":[]}]'::jsonb,
      '{}'::jsonb
    );
    raise exception 'FAIL 7: a dog with no events was accepted';
  exception when sqlstate 'P0001' then
    raise notice 'PASS 7: dog with no events refused';
  end;
end $$;

-- -----------------------------------------------------------------------
-- 8. Atomicity: the rejected entries left nothing behind. The old build
--    inserted the submission first, so a later failure orphaned it.
-- -----------------------------------------------------------------------
do $$
declare n integer;
begin
  select count(*) into n from public.submissions;
  if n <> 3 then
    raise exception 'FAIL 8: expected exactly 3 submissions, found % (rejected entries left rows behind)', n;
  end if;
  raise notice 'PASS 8: 3 submissions, no orphans from the 4 rejected attempts';
end $$;

-- -----------------------------------------------------------------------
-- 9. THE CRITICAL PATH: anon can actually lodge an entry.
--    Everything above ran as postgres, which proves the logic but not that
--    a real website visitor can reach it.
-- -----------------------------------------------------------------------
do $$
declare r jsonb;
begin
  set local role anon;
  r := public.create_entry(
    '{"first_name":"Anon","surname":"Visitor","email":"visitor@example.com","phone":"021 555 0200"}'::jsonb,
    '[{"pedigree_name":"Ch Public Path","dogs_nz_registration":"04321-2025","breed":"Whippet",
       "events":[{"event_code":"show_dog","qualifying_show":"Otago All Breeds","qualifying_date":"2026-02-20"}]}]'::jsonb,
    '{"dinner_tickets":1}'::jsonb
  );
  if (r->>'total_amount')::numeric <> 75.00 then
    raise exception 'FAIL 9: expected 75.00, got %', r->>'total_amount';
  end if;
  raise notice 'PASS 9: anon lodged % for $%', r->>'reference', r->>'total_amount';
end $$;

-- -----------------------------------------------------------------------
-- 10. anon can read the show config it needs to render the form.
-- -----------------------------------------------------------------------
do $$
declare n integer;
begin
  set local role anon;
  select count(*) into n from public.shows;
  if n <> 1 then raise exception 'FAIL 10a: anon should see 1 active show, saw %', n; end if;
  select count(*) into n from public.show_events;
  if n <> 3 then raise exception 'FAIL 10b: anon should see 3 show events, saw %', n; end if;
  raise notice 'PASS 10: anon can read the show and its 3 events';
end $$;

-- -----------------------------------------------------------------------
-- 11. anon cannot read a single entry. This is the finding that made the
--     old build a privacy problem: names, emails and phone numbers were
--     readable by anyone holding the anon key, which ships in the bundle.
-- -----------------------------------------------------------------------
do $$
declare n integer; t text;
begin
  set local role anon;
  foreach t in array array['submissions', 'dog_entries', 'event_entries']
  loop
    begin
      execute format('select count(*) from public.%I', t) into n;
      if n <> 0 then
        raise exception 'FAIL 11: anon read % rows from %', n, t;
      end if;
      raise notice 'PASS 11: anon sees 0 rows in % (blocked by RLS)', t;
    exception when insufficient_privilege then
      raise notice 'PASS 11: anon has no grant on % at all', t;
    end;
  end loop;
end $$;

-- -----------------------------------------------------------------------
-- 12. anon cannot write to the entry tables directly, only via create_entry.
-- -----------------------------------------------------------------------
do $$
begin
  set local role anon;
  begin
    insert into public.submissions (
      show_id, entry_number, reference, exhibitor_first_name, exhibitor_surname,
      exhibitor_email, exhibitor_phone, total_amount
    )
    select id, 9999, 'HACK-0001', 'Free', 'Entry', 'free@example.com', '000', 0
      from public.shows limit 1;
    raise exception 'FAIL 12: anon inserted a submission directly';
  exception when insufficient_privilege then
    raise notice 'PASS 12: direct anon insert refused';
  end;
end $$;

-- -----------------------------------------------------------------------
-- 13. anon cannot tamper with the fees and then enter at the new price.
-- -----------------------------------------------------------------------
do $$
begin
  set local role anon;
  begin
    update public.show_events set entry_fee = 0;
    raise exception 'FAIL 13: anon changed the entry fee';
  exception when insufficient_privilege then
    raise notice 'PASS 13: anon cannot change fees';
  end;
end $$;

-- -----------------------------------------------------------------------
-- 14. Closing the show stops entries. This is the bug that left the 2025
--     form taking entries and bank transfers ten months after it closed.
-- -----------------------------------------------------------------------
do $$
declare r jsonb; v_msg text;
begin
  update public.shows set entries_close_at = now() - interval '1 day' where year = 2026;
  begin
    r := public.create_entry(
      '{"first_name":"Too","surname":"Late","email":"late@example.com","phone":"021 555 0107"}'::jsonb,
      '[]'::jsonb, '{"dinner_tickets":1}'::jsonb
    );
    raise exception 'FAIL 14: an entry was accepted after the close date';
  exception when sqlstate 'P0001' then
    get stacked diagnostics v_msg = message_text;
    if v_msg not like '%closed on%' then raise; end if;
    raise notice 'PASS 14: entries refused after close (%)', v_msg;
  end;
  update public.shows set entries_close_at = '2026-10-22 23:59:59 Pacific/Auckland'::timestamptz where year = 2026;
end $$;

-- -----------------------------------------------------------------------
-- 15. Only one show can be active at a time.
-- -----------------------------------------------------------------------
do $$
begin
  begin
    insert into public.shows (
      year, name, show_date, entries_open_at, entries_close_at,
      qualification_start, qualification_end, dinner_ticket_fee,
      extra_catalogue_fee, bank_account_name, bank_account_number, is_active
    ) values (
      2027, 'Next year', '2027-11-27',
      now(), now() + interval '30 days', '2026-10-20', '2027-10-18',
      45, 10, 'x', 'y', true
    );
    raise exception 'FAIL 15: a second active show was allowed';
  exception when unique_violation then
    raise notice 'PASS 15: only one show can be active';
  end;
end $$;

select 'ALL CHECKS PASSED' as result;
