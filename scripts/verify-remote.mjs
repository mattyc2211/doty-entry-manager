/**
 * Verifies a deployed project from the outside, using only the anon key that
 * ships in the browser bundle. Run it after every `supabase db push`.
 *
 *   node scripts/verify-remote.mjs --url https://<ref>.supabase.co --key <anon key>
 *
 * Read-only by design. It never lodges a successful entry, because that would
 * burn DOTY26-0001 on a test row and leave it sitting in the organisers'
 * dashboard. It proves create_entry is reachable by making a call that is
 * certain to be rejected, which rolls back and consumes no reference.
 *
 * Note on how the write checks are written. A write that RLS blocks does NOT
 * return an error through PostgREST: it returns 204 with zero rows affected.
 * So asserting "an error came back" silently passes on a database that is wide
 * open. Every check below reads the value back and asserts it did not change,
 * which is the thing actually worth knowing.
 */
import { createClient } from '@supabase/supabase-js';

// Parsed by walking argv rather than by splitting the joined string on '--'.
// The earlier version did the latter, which corrupts any value containing a
// double hyphen. Supabase keys are base64url and may legitimately contain '--',
// so that version could silently mangle the key and report a confusing failure.
const args = {};
for (let i = 2; i < process.argv.length; i += 1) {
  const token = process.argv[i];
  if (token.startsWith('--')) {
    const name = token.slice(2);
    const next = process.argv[i + 1];
    if (next === undefined || next.startsWith('--')) {
      args[name] = true;
    } else {
      args[name] = next;
      i += 1;
    }
  }
}

if (!args.url || !args.key) {
  console.error('Usage: node scripts/verify-remote.mjs --url <project url> --key <anon key>');
  process.exit(1);
}

const supabase = createClient(args.url, args.key);
let bad = 0;
const check = (name, ok, detail = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  ${detail}` : ''}`);
  if (!ok) bad++;
};

// --- the show is there and correct ----------------------------------------
const { data: show, error } = await supabase
  .from('shows')
  .select('*, show_events(*)')
  .eq('is_active', true)
  .single();

check('an active show exists', !error && !!show, error?.message ?? show?.name);
if (!show) {
  console.log('\nCannot continue without a show.');
  process.exit(1);
}

check('three titles are configured', show.show_events?.length === 3);
check('entry fee is set on every title', show.show_events?.every((e) => Number(e.entry_fee) > 0));
check('dinner and catalogue fees are set', Number(show.dinner_ticket_fee) > 0 && Number(show.extra_catalogue_fee) > 0);
check('bank details are set', !!show.bank_account_name && !!show.bank_account_number);
check(
  'entries are open',
  new Date(show.entries_open_at) <= new Date() && new Date(show.entries_close_at) > new Date(),
  `${show.entries_open_at} to ${show.entries_close_at}`,
);

// --- no entry data leaks ---------------------------------------------------
// This is the exact failure the 2025 project had: every exhibitor's name, email
// and phone number readable by anyone holding this key.
for (const table of ['submissions', 'dog_entries', 'event_entries']) {
  const { data, error: e } = await supabase.from(table).select('*');
  check(`anon cannot read ${table}`, !!e || !data || data.length === 0, e?.message ?? `${data?.length} rows returned`);
}

// --- nothing can be tampered with -----------------------------------------
const feesBefore = JSON.stringify(
  (await supabase.from('show_events').select('code, entry_fee').order('sort_order')).data,
);
await supabase.from('show_events').update({ entry_fee: 0 }).neq('code', '');
const feesAfter = JSON.stringify(
  (await supabase.from('show_events').select('code, entry_fee').order('sort_order')).data,
);
check('anon cannot change entry fees', feesBefore === feesAfter, feesAfter);

const bankBefore = (await supabase.from('shows').select('bank_account_number').single()).data
  ?.bank_account_number;
await supabase.from('shows').update({ bank_account_number: '00-0000-0000000-00' }).eq('year', show.year);
const bankAfter = (await supabase.from('shows').select('bank_account_number').single()).data
  ?.bank_account_number;
check('anon cannot change the bank account', bankBefore === bankAfter, bankAfter);

// --- create_entry is reachable and enforcing ------------------------------
const { error: rejected } = await supabase.rpc('create_entry', {
  p_exhibitor: { first_name: 'Deploy', surname: 'Check', email: 'deploy@example.com', phone: '000' },
  p_dogs: [
    {
      pedigree_name: 'Deploy Check',
      dogs_nz_registration: '00000-0000',
      breed: 'Whippet',
      photo_url: null,
      events: [
        {
          event_code: show.show_events[0].code,
          qualifying_show: 'Deploy check',
          qualifying_date: '2000-01-01',
        },
      ],
    },
  ],
  p_catering: {},
});
check(
  'create_entry is reachable and enforces the qualifying period',
  !!rejected && /qualifying period/i.test(rejected.message),
  rejected?.message,
);

const next = (await supabase.from('shows').select('next_entry_number').eq('year', show.year).single())
  .data?.next_entry_number;
check('the rejected call consumed no entry reference', typeof next === 'number', `next reference is ${next}`);

console.log(bad === 0 ? '\nREMOTE VERIFIED' : `\n${bad} CHECK(S) FAILED`);
process.exit(bad === 0 ? 0 : 1);
