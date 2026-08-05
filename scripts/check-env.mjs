/**
 * Fails the build if the Supabase settings are missing.
 *
 * Vite inlines `import.meta.env.VITE_*` at build time. If the variables are not
 * set, the build still succeeds and produces a bundle that throws on first
 * load, so the deploy goes green and the site is white. That is a worse failure
 * than a red build, because nothing tells you it happened.
 *
 * Run from amplify.yml's preBuild.
 */
const required = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];
const missing = required.filter((name) => !process.env[name]);

if (missing.length > 0) {
  console.error(`\nMissing build environment ${missing.length === 1 ? 'variable' : 'variables'}: ${missing.join(', ')}`);
  console.error('\nIn the Amplify console: App settings -> Environment variables.');
  console.error('Values are in Supabase: Project Settings -> API.');
  console.error('  VITE_SUPABASE_URL       https://<project-ref>.supabase.co');
  console.error('  VITE_SUPABASE_ANON_KEY  the anon / public key\n');
  console.error('Do NOT use the service_role key. It bypasses every row level');
  console.error('security policy and this value is compiled into the browser bundle.\n');
  process.exit(1);
}

if (/service_role/.test(Buffer.from((process.env.VITE_SUPABASE_ANON_KEY.split('.')[1] ?? ''), 'base64').toString())) {
  console.error('\nVITE_SUPABASE_ANON_KEY is a service_role key.');
  console.error('That key bypasses row level security and would be published to every');
  console.error('visitor in the JavaScript bundle. Use the anon / public key.\n');
  process.exit(1);
}

console.log(`Supabase build config present: ${process.env.VITE_SUPABASE_URL}`);
