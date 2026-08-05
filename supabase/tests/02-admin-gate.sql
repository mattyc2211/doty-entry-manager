-- Does the admin gate actually hold?
--
-- In the 2025 build "admin" meant a localStorage key with a recent timestamp,
-- checked in the browser, with RLS granting the reads to everyone anyway. The
-- claim now is that admin is a real identity enforced in the database. This
-- tests that claim from both sides: a signed-in non-admin must see nothing.

\set ON_ERROR_STOP on

-- Two real auth users: one made an admin, one deliberately not.
insert into auth.users (id, instance_id, aud, role, email, encrypted_password, created_at, updated_at)
values
  ('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000',
   'authenticated', 'authenticated', 'admin@example.com', 'x', now(), now()),
  ('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000',
   'authenticated', 'authenticated', 'random@example.com', 'x', now(), now());

insert into public.admins (user_id, email)
values ('11111111-1111-1111-1111-111111111111', 'admin@example.com');

-- 16. A signed-in user who is NOT in public.admins sees nothing.
do $$
declare n integer;
begin
  set local role authenticated;
  set local request.jwt.claims = '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}';

  select count(*) into n from public.submissions;
  if n <> 0 then
    raise exception 'FAIL 16: a signed-in non-admin read % entries', n;
  end if;
  raise notice 'PASS 16: signed-in non-admin sees 0 entries';
end $$;

-- 17. The admin sees them all.
do $$
declare n integer;
begin
  set local role authenticated;
  set local request.jwt.claims = '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';

  select count(*) into n from public.submissions;
  if n <> 4 then
    raise exception 'FAIL 17: admin saw % entries, expected 4', n;
  end if;
  raise notice 'PASS 17: admin sees all 4 entries';
end $$;

-- 18. Marking an entry paid is an admin-only action.
do $$
declare n integer;
begin
  set local role authenticated;
  set local request.jwt.claims = '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}';

  update public.submissions set payment_status = 'paid', paid_at = now();
  get diagnostics n = row_count;
  if n <> 0 then
    raise exception 'FAIL 18a: a non-admin marked % entries paid', n;
  end if;
  raise notice 'PASS 18a: non-admin cannot mark entries paid';
end $$;

do $$
declare n integer;
begin
  set local role authenticated;
  set local request.jwt.claims = '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';

  update public.submissions set payment_status = 'paid', paid_at = now()
   where reference = 'DOTY26-0001';
  get diagnostics n = row_count;
  if n <> 1 then
    raise exception 'FAIL 18b: admin marked % entries paid, expected 1', n;
  end if;
  raise notice 'PASS 18b: admin can mark an entry paid';
end $$;

-- 19. payment_status is constrained, so a typo cannot invent a state that the
--     unpaid list then silently skips.
do $$
begin
  begin
    update public.submissions set payment_status = 'PAID' where reference = 'DOTY26-0002';
    raise exception 'FAIL 19: an invalid payment_status was accepted';
  exception when check_violation then
    raise notice 'PASS 19: invalid payment_status refused';
  end;
end $$;

-- 20. The admin list itself is not readable by a signed-in non-admin.
do $$
declare n integer;
begin
  set local role authenticated;
  set local request.jwt.claims = '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}';
  select count(*) into n from public.admins;
  if n <> 0 then
    raise exception 'FAIL 20: a non-admin enumerated % admins', n;
  end if;
  raise notice 'PASS 20: non-admin cannot enumerate admins';
end $$;

select 'ADMIN GATE CHECKS PASSED' as result;
