/**
 * End-to-end smoke test through PostgREST as `anon`, which is exactly the path
 * the browser takes. The SQL tests in supabase/tests prove the database
 * behaves; this proves the app can reach it, through the API, with the same key
 * that ships in the bundle.
 *
 *   node scripts/smoke.mjs
 *
 * Reads .env, so it points wherever the app points.
 */
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';

const env = Object.fromEntries(
  readFileSync(new URL('../.env', import.meta.url), 'utf8')
    .split('\n')
    .filter((l) => l.trim() && !l.trim().startsWith('#'))
    .map((l) => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, '')];
    }),
);

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

let failures = 0;
const check = (name, ok, detail = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  ${detail}` : ''}`);
  if (!ok) failures++;
};

// 1. The show loads, with its events, exactly as the entry form needs it.
const { data: show, error: showError } = await supabase
  .from('shows')
  .select('*, show_events(*)')
  .eq('is_active', true)
  .single();

check('show loads for anon', !showError && !!show, showError?.message ?? show?.name);
check('show has its three titles', show?.show_events?.length === 3);

// 2. An entry goes in, and comes back priced by the server.
const eventCode = show.show_events.find((e) => e.code === 'show_dog')?.code;
const { data: receipt, error: entryError } = await supabase.rpc('create_entry', {
  p_exhibitor: {
    first_name: 'Smoke',
    surname: 'Test',
    email: 'smoke@example.com',
    phone: '021 555 0900',
  },
  p_dogs: [
    {
      pedigree_name: 'Ch Smoke Test Dog',
      dogs_nz_registration: '00000-2025',
      breed: 'Whippet',
      photo_url: null,
      events: [
        {
          event_code: eventCode,
          qualifying_show: 'Smoke Test Championship',
          qualifying_date: '2026-04-01',
        },
      ],
    },
  ],
  p_catering: { dinner_tickets: 2, extra_catalogues: 1, dietary_requirements: null },
});

// 30 entry + (2 x 45) dinner + 10 catalogue = 130
check(
  'anon can lodge an entry',
  !entryError && !!receipt?.reference,
  entryError?.message ?? receipt?.reference,
);
check(
  'server priced it at $130',
  Number(receipt?.total_amount) === 130,
  `got ${receipt?.total_amount}`,
);
check('reference is sequential', /^DOTY26-\d{4}$/.test(receipt?.reference ?? ''));

// 3. The entry the exhibitor just made is not readable back by anyone.
const { data: leaked } = await supabase.from('submissions').select('*');
check('anon cannot read entries back', !leaked || leaked.length === 0);

// 4. A qualifying date outside the period is refused, with a message a person
//    can act on rather than a constraint name.
const { error: badDate } = await supabase.rpc('create_entry', {
  p_exhibitor: {
    first_name: 'Bad',
    surname: 'Date',
    email: 'bad@example.com',
    phone: '021 555 0901',
  },
  p_dogs: [
    {
      pedigree_name: 'Ch Out Of Period',
      dogs_nz_registration: '00001-2025',
      breed: 'Pug',
      photo_url: null,
      events: [
        {
          event_code: eventCode,
          qualifying_show: 'Too Old Show',
          qualifying_date: '2024-01-01',
        },
      ],
    },
  ],
  p_catering: {},
});
check(
  'out-of-period date refused',
  !!badDate && /qualifying period/i.test(badDate.message),
  badDate?.message,
);

// 5. A photo can be uploaded, and cannot then be deleted by the next visitor.
const blob = new Blob([new Uint8Array([0xff, 0xd8, 0xff, 0xd9])], { type: 'image/jpeg' });
const path = `smoke-${Date.now()}.jpg`;
const { error: uploadError } = await supabase.storage.from('dog-photos').upload(path, blob);
check('anon can upload a dog photo', !uploadError, uploadError?.message);

const { error: deleteError, data: deleted } = await supabase.storage
  .from('dog-photos')
  .remove([path]);
check(
  'anon cannot delete dog photos',
  !!deleteError || !deleted || deleted.length === 0,
  deleteError?.message ?? `removed ${deleted?.length ?? 0}`,
);

console.log(failures === 0 ? '\nALL SMOKE CHECKS PASSED' : `\n${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
