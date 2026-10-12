# Backend

Node-based backend for the portfolio app. Uses `pg` with `DATABASE_URL`.

Scripts:

- `npm run dev` — start the backend server
- `npm run migrate` — apply SQL migrations in `prisma/migrations`
- `npm run test-neon` — run Neon connection test
- `npm run test:projects` — run project API and admin-auth endpoint tests

## Project management API

The public project list is `GET /api/projects`. The protected project editor
endpoints are:

- `GET /api/projects/manage`
- `POST /api/projects`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`
- `POST /api/projects/upload-signature`
- `DELETE /api/projects/media`

Public portfolio section content is returned by `GET /api/content`. The admin
editor uses the protected endpoints:

- `GET /api/content/manage`
- `PUT /api/content/:section` (`home`, `about`, `experience`, or `skills`)
- `DELETE /api/content/:section` (reset a section to the frontend defaults)
- `POST /api/content/upload-signature`
- `DELETE /api/content/media`

Every protected write requires a valid Neon Auth JWT, a verified account
email, and an exact case-insensitive match with `ADMIN_EMAIL`. The API verifies
tokens using `NEON_AUTH_JWKS_URL` and requires the JWT issuer/audience to match
the origin of `NEON_AUTH_BASE_URL`. The React client requests short-lived
bearer tokens with Neon Auth's `token()` method; see Neon’s
[JWT guide](https://neon.com/docs/auth/guides/plugins/jwt).

To restrict new account creation to the portfolio administrator, configure a
Neon Auth `user.before_create` webhook at
`https://<your-domain>/api/webhooks/neon-auth`. The endpoint verifies Neon's
Ed25519 detached-JWS signature against `NEON_AUTH_JWKS_URL`, rejects stale
signatures, and allows only the `ADMIN_EMAIL` address. Configure the webhook
before creating the admin account; it does not remove existing users.

Set `ADMIN_EMAIL`, `NEON_AUTH_BASE_URL`, `NEON_AUTH_JWKS_URL`,
`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and
`CLOUDINARY_API_SECRET` in the repository-root `.env` for local backend use.
The corresponding frontend build requires `VITE_NEON_AUTH_URL`; see the
repository-root [deployment guide](../DEPLOYMENT.md) for Neon Auth, Cloudinary,
Vercel, and migration setup. A safe variable template is at
[`../.env.example`](../.env.example); do not put real credentials in it.

Apply migrations only after confirming `DATABASE_URL` points at the intended
database. The portfolio-content migration copies the existing biography,
experience, and skills content into editable records and removes the six
known sample project records. Projects can be added with their real details
and image/video media in the project editor. The section editor supports
images, videos, and PDF files.

For deploying the frontend and API together on Vercel, see the repository-root
[deployment guide](../DEPLOYMENT.md).
