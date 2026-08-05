# Deploying to AWS Amplify Hosting

The app is a static Vite single page app. There is no server to run: the only
backend is Supabase, reached from the browser with the anon key, with row level
security doing the enforcing. Amplify is therefore only building files and
serving them from CloudFront.

`amplify.yml` and `customHttp.yml` are already in the repository root, so
Amplify picks both up on its own. Three things still have to be set in the
console, and **the first one will break the site if it is skipped**.

---

## 1. The SPA rewrite rule (do this first)

Without it, `/enter`, `/admin`, `/qualifying` and every other route returns 404
when someone opens the link directly or refreshes the page. The home page works,
which is what makes this easy to miss: it looks deployed until somebody sends a
friend a link.

**Hosting → Rewrites and redirects → Manage redirects → Open text editor**, and
add:

```json
[
  {
    "source": "</^[^.]+$|\\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json|webp)$)([^.]+$)/>",
    "status": "200",
    "target": "/index.html",
    "condition": null
  }
]
```

That is the rule from the AWS docs, verbatim:
<https://docs.aws.amazon.com/amplify/latest/userguide/redirect-rewrite-examples.html>

It rewrites anything without a file extension to `index.html` so React Router
can handle it, while leaving real assets alone. Status **200** (rewrite), not
301 or 302, so the address bar keeps the URL the exhibitor actually opened.

**Test after deploying:** open `https://<your-domain>/qualifying` directly in a
new tab. If it 404s, this rule is missing or ordered below something broader.

---

## 2. Environment variables

**App settings → Environment variables.** Both values come from Supabase under
**Project Settings → API**.

| Variable | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | `https://kbfktirsmwgxrwjgxqgy.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | the **anon / public** key |

Vite inlines anything prefixed `VITE_` at build time, so these are needed at
**build**, not at runtime, and changing them requires a redeploy rather than a
restart.

**Use the anon key, never the service_role key.** The service_role key bypasses
every row level security policy, and this value is compiled into the JavaScript
bundle that every visitor downloads. `scripts/check-env.mjs` runs in the
preBuild phase and fails the build if the variables are missing or if the key
supplied is a service_role key, because the alternative is a build that goes
green and a site that is either blank or wide open.

---

## 3. Supabase URL configuration

Once you have the Amplify domain, in Supabase under
**Authentication → URL Configuration**:

- **Site URL:** the Amplify domain (or your custom domain once attached)
- **Redirect URLs:** add the same

Password sign-in does not use a redirect, so the organiser login works without
this. Password **reset** does, and it will send people to `localhost` until this
is set.

---

## What is already handled in the repo

- **`amplify.yml`** pins Node 20, runs the env check, `npm ci`, then
  `npm run build`, and publishes `dist`. If the build image errors on
  `nvm use 20`, delete that line and set the Node version in the console's
  build image settings instead.
- **`customHttp.yml`** caches `/assets/**` for a year (Vite fingerprints those
  filenames) and forbids caching `index.html`. That second rule matters: a
  cached `index.html` points at asset filenames that no longer exist after a
  deploy, which looks like a broken site to returning visitors only. It also
  sets `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` and a
  `Permissions-Policy`.

---

## After the first deploy

Run the remote verification against the live project:

```sh
node scripts/verify-remote.mjs \
  --url https://kbfktirsmwgxrwjgxqgy.supabase.co \
  --key <anon key>
```

It checks the show is configured, entries are open, **no entry table returns a
single row to an anonymous caller**, and that neither the fees nor the bank
account can be altered from the browser. It is read-only and never lodges a real
entry, so it is safe to run against production whenever you want.

Then, by hand, the two things a script cannot judge:

1. Open `/qualifying` directly in a fresh tab. Confirms rule 1.
2. Sign in at `/admin`. Confirms the organiser account and the Supabase URL
   config.

---

## A note on cost

This is a static site on CloudFront plus a Supabase project. For a show taking a
few hundred entries a year, both sit in or near free tier. There is nothing here
that scales with traffic in a way worth watching, and no always-on compute.
