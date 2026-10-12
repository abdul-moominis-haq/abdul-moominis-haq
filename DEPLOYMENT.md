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
- `RESEND_API_KEY` — Resend API key. Required for newsletter emails if enabled
  and for Neon Auth email delivery when auth email webhook events are enabled.
- `FROM_EMAIL` — verified sender address in Resend. Required for Neon Auth
  email delivery and for newsletter emails when sending is enabled.
- `AUTH_APP_NAME` — optional sender heading in Neon Auth emails; defaults to
  `Portfolio`.
- `ADMIN_EMAIL` — verified Neon Auth email allowed to manage portfolio content.
- `NEON_AUTH_BASE_URL` — Neon Auth base URL for the configured database branch.
- `NEON_AUTH_JWKS_URL` — the branch's public JWKS endpoint, normally
  `<NEON_AUTH_BASE_URL>/.well-known/jwks.json`.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and
  `CLOUDINARY_API_SECRET` — server-only credentials for project and section
  media uploads and cleanup.
- `VITE_NEON_AUTH_URL` — Neon Auth base URL embedded in the frontend build for
  the private admin sign-in screen.

Leave `VITE_API_URL` unset for a single-origin Vercel deployment. The frontend
then calls `/api/...` on its own domain. Set it only when intentionally using a
separately hosted API, and set it before the Vite build because Vite embeds
`VITE_` values in the client bundle.

Never commit production credentials or put server-only secrets in `VITE_`
variables.

## Admin setup

The portfolio editor is available at `/admin`; project records and their media
are managed at `/admin/projects`. Write endpoints require a verified Neon Auth
JWT and a matching `ADMIN_EMAIL`; the email allowlist is checked by the backend
on every write. Creating an auth account by itself does not grant admin access.

1. Enable Managed Better Auth on the same Neon branch as the application
   database. Copy its Auth Base URL into `VITE_NEON_AUTH_URL` for the frontend
   build and `NEON_AUTH_BASE_URL` in the server environment. Set
   `NEON_AUTH_JWKS_URL` to that URL with `/.well-known/jwks.json` appended.
   See Neon’s [React quickstart](https://neon.com/docs/auth/quick-start/react)
   and [JWT verification guide](https://neon.com/docs/auth/guides/plugins/jwt)
   for the Auth Base URL and token behavior.
2. Add every production origin used for sign-in and email returns to Neon
   Auth's trusted domains, including `https://your-domain` and
   `https://www.your-domain` if both are served. For preview deployments, add
   the exact preview origins or an appropriate Vercel wildcard. Localhost
   ports are preconfigured for development.
   See [Configure trusted domains](https://neon.com/docs/auth/guides/configure-domains).
3. In **Neon Console → Settings → Better Auth**, enable email/password sign-in,
   sign-up email verification, and choose verification codes (not links). The
   admin screens accept the six-digit code and resend it; codes expire after
   15 minutes. Password recovery also uses a six-digit email code. Configure
   the email OTP feature for the branch.
   See [Email verification](https://neon.com/docs/auth/guides/email-verification)
   and [Password reset](https://neon.com/docs/auth/guides/password-reset).
4. Set `ADMIN_EMAIL` to the administrator's email in the backend environment.
   Configure the Neon Auth webhook before creating the admin account.
5. In **Neon Console → Auth → Configuration → Webhooks**, set the HTTPS URL to
   `https://<your-domain>/api/webhooks/neon-auth`, enable
   `user.before_create` and `send.otp`, and use a timeout of 8–10 seconds.
   The first event rejects new accounts unless their email matches
   `ADMIN_EMAIL`; the OTP event sends verification and password-reset emails
   through Resend. If you also enable email-link flows, enable
   `send.magic_link`; this backend validates links against the configured Neon
   Auth origin before mailing them. Neon skips its default email delivery for
   events handled by this webhook, so set `RESEND_API_KEY` and `FROM_EMAIL`
   before enabling either send event. The handler verifies Neon Auth's Ed25519
   detached-JWS signature and rejects timestamps outside a five-minute window.
   Delivery retries are deduplicated by Neon event ID at Resend.
   See [Customize emails](https://neon.com/docs/auth/guides/customize-emails)
   and [Neon Auth webhooks](https://neon.com/docs/auth/guides/webhooks).
6. Set the application name in **Neon Console → Settings → Better Auth**.
   For production, configure your own email provider, verify the sender domain,
   and disable localhost access for the production branch. Email-link
   verification requires a custom provider; the current admin UI uses codes.
   Review Neon’s [Auth production checklist](https://neon.com/docs/auth/production-checklist).
7. Create a Cloudinary account and configure the three server-only
   `CLOUDINARY_*` values above. Uploads are signed by the API and sent directly
   from the browser to Cloudinary; the API secret must never use a `VITE_`
   variable.
8. Copy the environment examples (`.env.example` and
   `frontend/.env.example`) for local development, replacing placeholders with
   your own values. Do not commit populated environment files.
9. Create or sign in to the admin account with `ADMIN_EMAIL`, then verify its
   email before editing. The backend independently checks both the verified
   JWT and matching email on every protected write.

Email/password is the only sign-in provider enabled by this implementation.
OAuth buttons and provider credentials are intentionally not included.

### Manage Neon Auth configuration

Neon Auth configuration belongs to a specific project branch and is managed
outside this app. Use the Neon Console for the initial setup above, or the
[Neon Auth CLI](https://neon.com/docs/cli/neon-auth) and
[branch-scoped Neon Auth API](https://neon.com/docs/auth/guides/manage-auth-api)
for automation. The API uses
`https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/auth`;
the webhook settings are at `/auth/webhooks`, trusted domains at `/auth/domains`,
email/password settings at `/auth/email_and_password`, and sender provider
settings at `/auth/email_provider`. Authenticate API calls server-side with a
Neon API key; never put that key in the frontend or commit it. Each development,
preview, and production branch has independent Auth settings and trusted
domains.

For branding, the signed `send.otp` and `send.magic_link` webhook events use
Resend templates in `backend/src/mailer.js`. Do not subscribe to those events
until Resend has a verified sender and both server-side variables above are
configured. If custom webhook delivery is disabled, Neon resumes its default
email behavior.

The project manager accepts images up to 15 MB and videos up to 100 MB. The
section editor accepts images, videos, and PDF documents (up to 15 MB, 100 MB,
and 25 MB respectively). Uploads go directly to Cloudinary using a signed
request and are published after the associated section is saved. The backend
keeps the Cloudinary secret server-side.

## Database setup

Apply the checked-in SQL migrations to the target database before enabling
write endpoints. To create all backend tables in one run from the Neon SQL
Editor, open and execute
[`backend/scripts/migrate-all.sql`](./backend/scripts/migrate-all.sql). It
creates the contact, meeting, notification, newsletter, project, and editable
portfolio-content tables; seeds editable profile sections without overwriting
existing content; and removes only the six known demo project slugs. It also
records the checked-in migration names in `public.applied_migrations`, so the
backend migration runner recognizes them.

Alternatively, confirm `DATABASE_URL` points to the intended database before
migrating. For schema migrations, use the direct Neon connection string
rather than the pooled `-pooler` endpoint:

```powershell
npm --prefix backend run migrate
```

The migration command loads `DATABASE_URL` from the repository-root `.env`
locally; in CI or a one-off shell, provide the direct database URL through the
environment instead. Vercel's runtime can continue using the pooled Neon
connection URL. Do not run the SQL script and migration runner against
different databases.

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
- Neon Auth reports `invalid domain` or an email/OAuth return is blocked:
  add the exact site origin (including `https://` and any `www` host) to the
  branch's trusted domains.
- Verification or recovery codes are not delivered: confirm the selected
  Neon Auth branch, `NEON_AUTH_JWKS_URL`, the `send.otp` webhook event, and the
  Resend `RESEND_API_KEY`/verified `FROM_EMAIL`. A subscribed send webhook
  replaces Neon's default delivery for that event.
- A Neon Auth setting works in development but not production: Auth settings
  are branch-specific; check the production branch's email verification,
  webhook, sender, trusted domains, and localhost-access configuration.
- API database errors usually mean `DATABASE_URL` is missing from the
  deployment environment or the migrations have not been applied.
