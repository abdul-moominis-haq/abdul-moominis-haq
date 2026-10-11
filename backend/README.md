# Backend

Node-based backend for the portfolio app. Uses `pg` with `DATABASE_URL`.

Scripts:

- `npm run dev` — start the backend server
- `npm run migrate` — apply SQL migrations in `prisma/migrations`
- `npm run test-neon` — run Neon connection test

For deploying the frontend and API together on Vercel, see the repository-root
[deployment guide](../DEPLOYMENT.md).
