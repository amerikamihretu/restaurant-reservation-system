# RestoReserve

Restaurant discovery and table reservation system with a React/Vite frontend, Express/Mongoose API, JWT authentication, and role-based customer, restaurant-owner, and administrator workflows.

## Requirements

- Node.js 20 or newer (the backend uses Node's `--env-file` support)
- MongoDB 7+ running locally or a reachable MongoDB deployment

## Configuration

Copy `backend/.env` to the deployment environment and set:

| Variable | Description |
| --- | --- |
| `PORT` | API port, normally `5000` |
| `NODE_ENV` | `development`, `test`, or `production` |
| `CLIENT_ORIGINS` | Comma-separated exact trusted frontend origins (the singular `CLIENT_ORIGIN` remains supported) |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Access-token secret, at least 32 characters |
| `JWT_REFRESH_SECRET` | Refresh-token secret, at least 32 characters |
| `JWT_EXPIRES_IN` | Access-token lifetime, for example `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh-token lifetime, for example `7d` |
| `ALLOW_ADMIN_REGISTRATION` | Set to `true` only for local development/testing; keep `false` in production |
| `ADMIN_INITIAL_PASSWORD` | Protected initial administrator password, at least 12 characters; used only by the seed command |

Use `backend\.env.example` as the template. Never commit real secrets or deploy the local `.env`.

Access tokens expire after 15 minutes and refresh sessions after 7 days. Both are Secure/HttpOnly cookies; no authentication token is stored in `localStorage` or `sessionStorage`. Mutating requests use the CSRF cookie/header check. Production must use HTTPS and exact CORS origins.

Registration passwords must contain at least 4 characters. Any letters, numbers,
or symbols are accepted and passwords continue to be hashed with bcrypt.
Registration accepts `CUSTOMER` and `RESTAURANT_OWNER`. `ADMIN` registration is
available only when `ALLOW_ADMIN_REGISTRATION=true` and `NODE_ENV` is not
`production`; keep that flag disabled outside local development/testing.

## Run locally in PowerShell

```powershell
cd .\backend
npm install
npm run dev
```

Create the single initial administrator explicitly before starting the server. Set
`ADMIN_INITIAL_PASSWORD` in the protected backend environment (or PowerShell
process environment), then run:

```powershell
cd .\backend
$env:ADMIN_INITIAL_PASSWORD = '<protected-password>'
npm run seed:admin
```

The seed is idempotent: rerunning it does not create or modify the existing
initial administrator. The server does not seed accounts on startup.
Do not put the password in source control, frontend code, documentation, or
logs.

If this database was created by an older version of the application, synchronize
the current User and refresh-session indexes once:

```powershell
cd .\backend
npm run sync:indexes
```

This migrates obsolete refresh-session metadata to revoked records and removes
the old unique `token` index before creating the current unique `tokenHash`
index. User and reservation data is not deleted.

In another PowerShell window:

```powershell
cd .\frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The Vite proxy forwards `/api` requests to the backend on port 5000.

## Verification and deployment

```powershell
cd .\backend
npm run build
cd ..\frontend
npm run lint
npm run build
```

For deployment, provision MongoDB, configure the backend environment variables in the host, run `npm install --omit=dev` and `npm start` from `backend`, and build the frontend with `npm run build` from `frontend`. Serve `frontend\dist` from a TLS-enabled static host whose API proxy routes `/api` to the backend, and set `CLIENT_ORIGINS` to the public frontend URL. A Mongo replica set is not required for booking safety: three occupied half-hour keys have a unique multikey index, with the exact overlap query and HTTP 409 conflict response as a second guard.

## Implemented workflows

- Registration, login, refresh-token logout, current-user lookup, account status enforcement, and role-protected routes.
- Public approved-restaurant discovery, text/cuisine/city filtering, detail pages, owner profile create/update, and administrator approval/rejection.
- Owner table create/list/update/delete and availability lookup that excludes overlapping pending/confirmed reservations.
- Customer reservation creation, capacity/date/time validation, conflict protection, listing, and cancellation.
- Owner reservation filtering and status transitions.
- Administrator analytics, user search, suspension/reactivation, restaurant moderation, and consistent API error responses.
