# Backend

Node-based backend for the portfolio app. Uses `pg` with `DATABASE_URL`.

Scripts:

- `npm run dev` — start the backend server
- `npm run migrate` — apply SQL migrations in `prisma/migrations`
- `npm run test-neon` — run Neon connection test
- `npm run test:projects` — run project API and admin-auth endpoint tests

## Project management API

The public project list is `GET /api/projects`. The protected editor endpoints
are:

- `GET /api/projects/manage`
- `POST /api/projects`
- `PUT /api/projects/:id`
- `DELETE /api/projects/:id`
- `POST /api/projects/upload-signature`
- `DELETE /api/projects/media`

Project writes require a valid Neon Auth JWT, a verified account email, and an
exact case-insensitive match with `ADMIN_EMAIL`. The API verifies tokens using
`NEON_AUTH_JWKS_URL` and requires the JWT issuer/audience to match the origin
of `NEON_AUTH_BASE_URL`. The React client requests short-lived bearer tokens
with Neon Auth's `token()` method; see Neon’s
[JWT guide](https://neon.com/docs/auth/guides/plugins/jwt).

Set `ADMIN_EMAIL`, `NEON_AUTH_BASE_URL`, `NEON_AUTH_JWKS_URL`,
`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and
`CLOUDINARY_API_SECRET` in the repository-root `.env` for local backend use.
The corresponding frontend build requires `VITE_NEON_AUTH_URL`; see the
repository-root [deployment guide](../DEPLOYMENT.md) for Neon Auth, Cloudinary,
Vercel, and migration setup. A safe variable template is at
[`../.env.example`](../.env.example); do not put real credentials in it.

Apply the project-table migration only after confirming `DATABASE_URL` points
at the intended database. It inserts the six current static project records;
image/video assets and repository links can then be added or corrected in the
manager.

For deploying the frontend and API together on Vercel, see the repository-root
[deployment guide](../DEPLOYMENT.md).
