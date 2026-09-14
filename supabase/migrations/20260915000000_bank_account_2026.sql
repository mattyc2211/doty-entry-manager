-- The 2026 show's bank account changed. The seed (20260805000100_show_2026.sql)
-- carried 12-3031-0250030-00 across from the 2025 build; the account the
-- organisers actually want entry fees paid into is 12-3031-0340570-00
-- (confirmed by Matt, 15 Sep 2026). The account name is unchanged.
--
-- Idempotent: safe to re-run, and a no-op once the row already holds the
-- new number.
update public.shows
   set bank_account_number = '12-3031-0340570-00'
 where year = 2026
   and bank_account_number is distinct from '12-3031-0340570-00';
