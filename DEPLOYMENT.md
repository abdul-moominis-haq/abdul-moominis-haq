# Vercel deployment

Deploy this repository from its root. Do not set the Vercel project root to
`frontend`; the API function and `vercel.json` are at the repository root.

## Vercel project settings

The root `vercel.json` configures the project:

- **Framework preset:** Vite
- **Install command:** `npm ci`
- **Build command:** `npm run build`
- **Output directory:** `frontend/dist`

The explicit npm install command selects the root `package-lock.json` even
though the repository also contains a Bun lockfile. The root package contains
the frontend and API runtime dependencies.

The API is deployed as a Vercel Node.js Function from `api/[...path].js`.
Frontend routes fall back to `frontend/dist/index.html`, so direct visits and
refreshes on routes such as `/projects` continue to work.

## Environment variables

Add these in **Vercel → Project → Settings → Environment Variables** for each
environment that needs them:

- `DATABASE_URL` — required for contact, meeting, and newsletter writes. Use
  the Neon pooled connection URL and enable SSL.
- `FRONTEND_URL` — the deployed site origin, used to build newsletter
  confirmation links.
- `RESEND_API_KEY` — optional; without it, newsletter confirmation emails are
  skipped.
- `FROM_EMAIL` — optional sender address when Resend is enabled.
- `ADMIN_EMAIL` — verified Neon Auth email allowed to manage project records.
- `NEON_AUTH_BASE_URL` — Neon Auth base URL for the configured database branch.
- `NEON_AUTH_JWKS_URL` — the branch's public JWKS endpoint, normally
  `<NEON_AUTH_BASE_URL>/.well-known/jwks.json`.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and
  `CLOUDINARY_API_SECRET` — server-only credentials for project image/video
  uploads and cleanup.
- `VITE_NEON_AUTH_URL` — Neon Auth base URL embedded in the frontend build for
  the project-manager sign-in screen.

Leave `VITE_API_URL` unset for a single-origin Vercel deployment. The frontend
then calls `/api/...` on its own domain. Set it only when intentionally using a
separately hosted API, and set it before the Vite build because Vite embeds
`VITE_` values in the client bundle.

Never commit production credentials or put server-only secrets in `VITE_`
variables.

## Project manager setup

The editor is available at `/admin/projects`. Its write endpoints require a
verified Neon Auth JWT and a matching `ADMIN_EMAIL`; the email allowlist is
checked by the backend on every write. Creating an auth account by itself does
not grant project access.

1. Enable Managed Better Auth on the same Neon branch as the application
   database. Copy its Auth Base URL into `VITE_NEON_AUTH_URL` for the frontend
   build and `NEON_AUTH_BASE_URL` in the server environment. Set
   `NEON_AUTH_JWKS_URL` to that URL with `/.well-known/jwks.json` appended.
   See Neon’s [React quickstart](https://neon.com/docs/auth/quick-start/react)
   and [JWT verification guide](https://neon.com/docs/auth/guides/plugins/jwt)
   for the Auth Base URL and token behavior.
2. Add the production domain (and any Vercel preview domain you use) to Neon
   Auth's trusted domains. Localhost is preconfigured by Neon.
   See [Configure trusted domains](https://neon.com/docs/auth/guides/configure-domains).
3. Set `ADMIN_EMAIL` to the administrator's email. Sign up or sign in at
   `/admin/projects` using that address and verify it through Neon Auth.
4. Create a Cloudinary account and configure the three server-only
   `CLOUDINARY_*` values above. Uploads are signed by the API and sent directly
   from the browser to Cloudinary; the API secret must never use a `VITE_`
   variable.
5. Copy the environment examples (`.env.example` and
   `frontend/.env.example`) for local development, replacing placeholders with
   your own values. Do not commit populated environment files.

The manager accepts images up to 15 MB and videos up to 100 MB. It uploads
media to Cloudinary, then saves the media reference with each project record.
If the project API is not configured, the public portfolio retains its existing
static project fallback; this does not make the admin editor available.

## Database setup

Apply the checked-in SQL migrations to the target database before enabling
write endpoints. The new project migration creates the `portfolio_projects`
table and seeds the six existing project descriptions; it does not invent
repository links or media. Confirm that `DATABASE_URL` points to the intended
database before migrating. For schema migrations, use the direct Neon
connection string rather than the pooled `-pooler` endpoint:

```powershell
npm --prefix backend run migrate
```

The migration command loads `DATABASE_URL` from the repository-root `.env`
locally; in CI or a one-off shell, provide the direct database URL through the
environment instead. Vercel's runtime can continue using the pooled Neon
connection URL.

For local development, run the frontend and backend with `npm run dev`. Vite
proxies `/api` requests to the backend at `http://localhost:4000`; the same
relative API paths are served by the Vercel function after deployment.

## Troubleshooting

- A Vercel build that cannot find the output directory is usually using a
  project root of `frontend` or an output directory other than `frontend/dist`.
- A nested frontend URL that returns a 404 needs the root `vercel.json` SPA
  rewrite.
- Requests sent to `localhost:4000` in a deployed browser indicate that
  `VITE_API_URL` was set to a local URL during the build. Remove it for a
  same-origin deployment and redeploy.
- API database errors usually mean `DATABASE_URL` is missing from the
  deployment environment or the migrations have not been applied.
