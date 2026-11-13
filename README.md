# ToyCulture — run locally (beginner guide)

ToyCulture is three apps in one repo:

| What | Folder | Open in browser |
|------|--------|-----------------|
| **API (backend)** | `backendNew/` | http://localhost:5000/health |
| **Shop (customers)** | `frontend/` | http://localhost:5173 |
| **Admin panel** | `admin/` | http://localhost:5174 |

The shop and admin talk to the API through Vite’s proxy (`/api` → port **5000**).  
**You must start the API first** and keep it running while using the shop or admin.

---

## How the three apps work together

```mermaid
flowchart LR
  subgraph browsers [Browser]
    Shop["Shop :5173"]
    Admin["Admin :5174"]
  end
  subgraph vite [Vite dev server]
    FP["frontend/"]
    AP["admin/"]
  end
  subgraph api [Node API]
    BE["backendNew/ :5000"]
  end
  DB[(PostgreSQL)]

  Shop --> FP
  Admin --> AP
  FP -->|"/api/* proxied"| BE
  AP -->|"/api/* proxied"| BE
  BE --> DB
```

| Piece | Role |
|-------|------|
| **`backendNew/`** | Only app that touches the database. All business logic, auth, orders, payments. |
| **`frontend/`** | Customer website (browse, cart, checkout, account). React UI only — no direct DB. |
| **`admin/`** | Internal dashboard (products, orders, coupons, shipping). React UI only — no direct DB. |

In development, the browser never calls `localhost:5000` directly for normal pages. It calls `localhost:5173` or `5174`, and Vite forwards `/api/...` to the backend (`frontend/vite.config.js`, `admin/vite.config.js`).

---

## Project folders (what is where)

Root of the repo:

```text
toyCulture/
├── backendNew/   ← BACKEND (API + database) — run first
├── frontend/   ← STOREFRONT (customer React app)
├── admin/        ← ADMIN (staff React app)
└── README.md     ← Start here
```

### `backendNew/` — API & database

| Path | Purpose |
|------|---------|
| `app.js` | Starts Express server, mounts routes, connects PostgreSQL |
| `.env` | Secrets and config (copy from `.env.example`) |
| `prisma/schema.prisma` | Database models (User, Product, Order, Coupon, …) |
| `prisma/seed.js` | Demo admin, customer, products (`npm run seed`) |
| `routes/` | URL definitions (`/api/auth`, `/api/order`, `/api/admin/...`) |
| `controllers/` | HTTP handlers (validate input, send JSON response) |
| `services/` | Business logic and Prisma queries |
| `middlewares/` | JWT auth, admin role check |
| `validators/` | Request body validation (Joi) |
| `utils/` | Email, Razorpay helpers, shipping rules, slugs |

**Run:** `cd backendNew` → `npm run dev`  
**Command:** `node app.js` via nodemon — listens on **`PORT`** (use **5000** locally).

---

### `frontend/` — customer shop

| Path | Purpose |
|------|---------|
| `src/App.jsx` | Routes (home, shop, product, cart, checkout, account) |
| `src/pages/` | Screens (Home, ShopHome, CartCheckout, MyAccount, …) |
| `src/components/` | Header, footer, product cards, cart drawer, SEO |
| `src/context/` | Cart and auth state |
| `src/lib/` | API client, SEO, slugs, Razorpay checkout, shipping |
| `src/services/` | Auth API calls |
| `public/` | Static files (`robots.txt`, `sitemap.xml`) |
| `.env` | Optional: `VITE_RAZORPAY_KEY_ID`, `VITE_SITE_URL`, GA, Google login |

**Run:** `cd frontend` → `npm run dev` → http://localhost:5173

---

### `admin/` — admin dashboard

| Path | Purpose |
|------|---------|
| `src/App.jsx` | Admin routes (dashboard, products, orders, coupons, …) |
| `src/pages/` | Dashboard, ProductList, AddProduct, Orders, Coupons, Shipping, … |
| `src/layouts/AdminLayout.jsx` | Sidebar navigation |
| `src/context/AuthContext.jsx` | Admin login session (JWT) |
| `src/components/auth/RequireAdmin.jsx` | Blocks non-admin users |
| `src/lib/apiClient.js` | Calls `/api/...` (proxied to backend) |

**Run:** `cd admin` → `npm run dev` → http://localhost:5174  
**No `.env`** needed for local dev.

---

## API overview (`backendNew`)

Base URL in dev (via proxy): **`http://localhost:5173/api/...`** or **`http://localhost:5174/api/...`**  
Direct health check: **http://localhost:5000/health**

### Customer & public routes

| Prefix | Used by | Examples |
|--------|---------|----------|
| `/api/auth` | Shop + Admin login | Register, login, OTP |
| `/api/v1/products` | Shop | Product list, product by id/slug |
| `/api/home` | Shop home | Home sections data |
| `/api/categories`, `/api/brands` | Shop filters | Catalog metadata |
| `/api/cart`, `/api/wishlist` | Shop | Cart & wishlist (logged in) |
| `/api/checkout` | Shop | Checkout helpers |
| `/api/account` | Shop | Profile, addresses |
| `/api/order` | Shop checkout | Place order, payment verify, coupons |
| `/api/shipping` | Shop checkout | Pincode delivery check |
| `/api/reviews` | Shop | Product reviews |
| `/api/wallet` | Shop | Wallet balance |

### Admin routes (JWT + `ADMIN` role)

| Prefix | Used by admin pages |
|--------|---------------------|
| `/api/admin/dashboard` | Dashboard KPIs |
| `/api/admin/products` | Add / edit products |
| `/api/admin/categories`, `/api/admin/brands` | Catalog structure |
| `/api/admin/orders` | Orders, status, tracking |
| `/api/admin/coupons` | Promo codes |
| `/api/admin/shipping` | Optional pincode overrides |
| `/api/admin/users` | Customers |
| `/api/admin/reviews` | Moderation |
| `/api/admin/stock`, `/api/admin/reports` | Inventory & reports |

Full route list lives in `backendNew/app.js`.

---

## What to install first

| Tool | Check it works |
|------|----------------|
| [Node.js](https://nodejs.org/) **18+** (LTS) | `node -v` and `npm -v` in a terminal |
| [PostgreSQL](https://www.postgresql.org/download/) **14+** | Service running (Windows: Services → `postgresql`) |
| Git (optional) | `git --version` |

You do **not** need Razorpay, Gmail, or Google login to browse the shop and admin. Those are optional later.

---

## One-time setup (do this once)

### Step 0 — Get the code

```powershell
git clone https://github.com/studioelemento/toyCulture.git
cd toyCulture
```

If you already have the folder, `cd` into your project root (the folder that contains `backendNew`, `frontend`, and `admin`).

---

### Step 1 — Create the database

PostgreSQL must be running. Create an empty database named `toyculture`.

**Option A — pgAdmin:** connect to your server → Databases → Create → name `toyculture`.

**Option B — `psql`:**

```sql
CREATE DATABASE toyculture;
```

Remember the **postgres user password** you chose at install — you need it in the next step.

---

### Step 2 — Backend (required)

Open a terminal:

```powershell
cd backendNew
npm install
copy .env.example .env
```

Edit `backendNew/.env`. For a **first successful run**, set at least these three:

```env
DATABASE_URL="postgresql://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/toyculture"
PORT=5000
JWT_SECRET=change_this_to_any_long_random_string
```

- Replace `YOUR_POSTGRES_PASSWORD` with your real PostgreSQL password.
- **`PORT` must be `5000`** unless you also change `frontend/vite.config.js` and `admin/vite.config.js`.
- Leave Razorpay and `EMAIL`/`PASS` blank for now if you only want local testing (COD checkout still works).

Apply the database schema and sample data:

```powershell
npm run prisma:generate
npm run prisma:push
```

If Prisma warns about data loss, run:

```powershell
npx prisma db push --accept-data-loss
```

Seed users and demo products:

```powershell
npm run seed
```

Start the API:

```powershell
npm run dev
```

**You should see:**

- `PostgreSQL connected via Prisma`
- `Server listening on port 5000`

**Quick test:** open http://localhost:5000/health — you should see JSON with `"status":"ok"`.

Leave this terminal open.

> **Windows tip:** If `prisma generate` fails with “operation not permitted”, stop `npm run dev`, run `npm run prisma:generate`, then start `npm run dev` again.

---

### Step 3 — Shop (frontend)

Open a **new** terminal:

```powershell
cd frontend
npm install
npm run dev
```

`frontend/.env` is **optional** for first run (no file needed to load products).

**You should see:** Vite ready at http://localhost:5173  

Open that URL in your browser.

---

### Step 4 — Admin panel

Open a **third** terminal:

```powershell
cd admin
npm install
npm run dev
```

Admin has **no `.env` file** — it uses the same API proxy as the shop.

**You should see:** Vite ready at http://localhost:5174  

Open that URL and go to **Login**.

---

## Logins (created by `npm run seed`)

Use these **only after** Step 2 seed has finished and the API is running.

### Admin dashboard (http://localhost:5174)

| | |
|--|--|
| **Email** | `admin@toyculture.com` |
| **Password** | `Admin@123` |

### Customer shop (http://localhost:5173 → Sign in)

| | |
|--|--|
| **Email** | `customer@toyculture.com` |
| **Password** | `Customer@123` |

Demo coupon code (if you test checkout): **`TOY10`**.

---

## Daily workflow (after setup)

Same order every time — **3 terminals** (each `cd` from repo root):

| Step | Folder | Command | URL |
|------|--------|---------|-----|
| 1 | `backendNew` | `npm run dev` | http://localhost:5000/health |
| 2 | `frontend` | `npm run dev` | http://localhost:5173 |
| 3 | `admin` | `npm run dev` | http://localhost:5174 |

Keep terminal 1 running while you use the shop or admin.

---

## Optional features (not required to start)

| Feature | Where to configure |
|---------|-------------------|
| Online payment (Razorpay) | `RAZORPAY_KEY_ID` + `RAZORPAY_SECRET` in `backendNew/.env`; `VITE_RAZORPAY_KEY_ID` in `frontend/.env` |
| Order / OTP emails | `EMAIL` + `PASS` in `backendNew/.env` (e.g. Gmail app password) |
| Google sign-in | `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` in backend; `VITE_GOOGLE_CLIENT_ID` in `frontend/.env` |
| Analytics | `VITE_GA_MEASUREMENT_ID` in `frontend/.env` |
| SEO site URL | `VITE_SITE_URL=http://localhost:5173` in `frontend/.env` |
| Strict pincode list only | `SHIPPING_ENFORCE_WHITELIST=true` in `backendNew/.env` (default is pan-India) |

Copy `frontend/.env.example` → `frontend/.env` when you add these.

---

## Troubleshooting

| Problem | What to do |
|---------|------------|
| **`ECONNREFUSED` / shop shows no products** | Start backend first; check http://localhost:5000/health |
| **`PostgreSQL connection failed`** | Postgres running? `DATABASE_URL` password correct? Database `toyculture` exists? |
| **Port 5000 already in use** | Close the other app or set `PORT` in `.env` and update both Vite `proxy.target` values to match |
| **Admin login fails** | API running? Run `npm run seed` in `backendNew`; use exact email/password above |
| **Prisma / `findMany` errors after pull** | Stop API → `npm run prisma:generate` → `npm run prisma:push` → `npm run dev` |
| **`npm install` errors** | Use Node 18+; delete `node_modules` and run `npm install` again |
| **Razorpay / email errors** | Expected if keys not set; use **Cash on Delivery** to test orders |

---

## Production build (short)

```powershell
cd backendNew
npm start

cd ..\frontend
npm run build

cd ..\admin
npm run build
```

Deploy the API and static builds; add your real domain to CORS in `backendNew/app.js`.

---

More API detail: [`backendNew/README.md`](backendNew/README.md)

---

**ToyCulture** · Studio Elemento
