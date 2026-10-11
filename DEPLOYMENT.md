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

Leave `VITE_API_URL` unset for a single-origin Vercel deployment. The frontend
then calls `/api/...` on its own domain. Set it only when intentionally using a
separately hosted API, and set it before the Vite build because Vite embeds
`VITE_` values in the client bundle.

Never commit production credentials or put server-only secrets in `VITE_`
variables.

## Database setup

Apply the checked-in SQL migrations to the target database before enabling
write endpoints. The backend migration command reads `DATABASE_URL` from the
repository-root `.env` file locally; in CI or a one-off shell, provide the
database variable through that environment instead.

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
