# ToyCulture API (`backendNew`)

Express + Prisma + PostgreSQL. Serves both **frontend** (shop) and **admin**.

**Complete setup (folders, API map, all 3 apps, passwords):** [../README.md](../README.md)

This folder is the **only backend**. `frontend/` and `admin/` are separate React apps that call these HTTP routes.

---

## Quick commands

```powershell
npm install
copy .env.example .env
# Set DATABASE_URL, PORT=5000, JWT_SECRET in .env

npm run prisma:generate
npm run prisma:push
npm run seed
npm run dev
```

Health check: http://localhost:5000/health

---

## Seed logins

| Role | Email | Password |
|------|--------|----------|
| Admin | `admin@toyculture.com` | `Admin@123` |
| Customer | `customer@toyculture.com` | `Customer@123` |

---

## Scripts

| Command | Action |
|---------|--------|
| `npm run dev` | Dev server (port from `PORT`, default 5000) |
| `npm start` | Production |
| `npm run prisma:generate` | Regenerate client after schema changes |
| `npm run prisma:push` | Sync schema to PostgreSQL |
| `npm run seed` | Demo users, products, coupon `TOY10` |
| `npm run prisma:studio` | Visual DB browser |

---

## Environment

See `.env.example`. Minimum for local dev:

- `DATABASE_URL`
- `PORT=5000`
- `JWT_SECRET`

Optional: `RAZORPAY_*`, `EMAIL`/`PASS`, `SHIPPING_ENFORCE_WHITELIST`, Google OAuth.

---

## Folder layout (this package)

```text
backendNew/
├── app.js              # Server entry — mounts all /api routes
├── prisma/             # schema + seed
├── routes/             # auth, order, admin/*, shipping, …
├── controllers/        # Request handlers
├── services/           # DB + business logic
├── middlewares/        # JWT, admin guard
└── .env                # PORT=5000, DATABASE_URL, JWT_SECRET, …
```

Customer + public and full **`/api/admin/*`** tables: [../README.md#api-overview-backendnew](../README.md#api-overview-backendnew).
