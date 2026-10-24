# ToyCulture Backend Service

Robust, scalable REST API powering the **ToyCulture** e-commerce platform and its administrative dashboard. Built with Node.js, Express, Prisma ORM, and PostgreSQL.

---

## 🛠️ Tech Stack

- **Runtime:** Node.js (ES Modules, `type: module`)
- **Web Framework:** [Express.js](https://expressjs.com/) (v5)
- **Database & ORM:** [PostgreSQL](https://www.postgresql.org/) & [Prisma ORM](https://www.prisma.io/) (v5.22.0)
- **Authentication:** JWT (`jsonwebtoken`) & `bcrypt` password hashing
- **Payments:** [Razorpay](https://razorpay.com/) SDK integration
- **File & Media Uploads:** [Multer](https://github.com/expressjs/multer) & [Cloudinary](https://cloudinary.com/)
- **Validation:** [Joi](https://joi.dev/)
- **Logging & Utilities:** Winston, Morgan, Nodemailer

---

## 📁 Project Structure

```text
backendNew/
├── prisma/
│   └── schema.prisma          # Prisma schema definition (PostgreSQL)
├── controllers/
│   ├── admin/                 # Admin controllers (brands, categories, products, orders, etc.)
│   ├── user/                  # Customer-facing controllers (checkout, order, wishlist, etc.)
│   ├── auth.controller.js     # User registration, login, JWT issuance
│   └── product.controller.js  # Product browsing, filtering, search
├── routes/
│   ├── admin/                 # Protected admin management endpoints
│   ├── user/                  # Customer transactional endpoints
│   ├── auth.routes.js         # Authentication routes
│   └── product.routes.js      # Public product catalog routes
├── services/
│   ├── admin/                 # Business logic for admin features (Prisma database access)
│   └── user/                  # Business logic for user features
├── middlewares/               # Authentication guards, error handlers, uploads
├── utils/                     # JWT helpers, mailer, validators
├── app.js                     # Express app initialization, middleware pipeline, listener
├── .env.example               # Template environment variables
└── package.json               # Dependencies and runner scripts
```

---

## ⚙️ Prerequisites

1. **Node.js**: v18.0.0 or higher
2. **npm**: v9.0.0 or higher
3. **PostgreSQL**: v14+ running locally or remotely (default port: `5432`)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Ensure your `.env` contains:
```env
# Database connection string
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/toyculture?schema=public"

# Server Port
PORT=5000

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key

# Payment Gateway (Razorpay)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_SECRET=your_razorpay_secret

# Email Services (SMTP / Nodemailer)
EMAIL=your_smtp_email@gmail.com
PASS=your_app_specific_password

# OTP Configuration
OTP_INVALID_TIME=120
OTP_EXPIRY_TIME=300
OTP_VERIFY_LIMIT=3
```

### 3. Generate Prisma Client & Sync Database
```bash
# Generate the latest Prisma client
npm run prisma:generate

# Push schema directly to PostgreSQL database
npm run prisma:push
```

*(Optional) Explore and inspect your database visually:*
```bash
npm run prisma:studio
```

### 4. Run the Server
- **Development (with hot reload):**
  ```bash
  npm run dev
  ```
- **Production / Direct run:**
  ```bash
  npm start
  ```

Server will start listening on `http://localhost:5000` (or configured `PORT`).

---

## 🗄️ Database Schema & Architecture

### Core Relational Models

- **Brand (`brands`)**:
  - `id`: Auto-increment integer (Primary Key)
  - `name`: Unique brand name
  - `seo_title`: Meta SEO title
  - `seo_description`: Meta description
  - `is_active`: Status flag
  - Relation: `products Product[]` (One-to-Many)

- **Category (`categories`)**:
  - `id`: Auto-increment integer (Primary Key)
  - `name`: Unique category name
  - `parent_id`: Foreign key referencing parent category (Nullable for top-level categories)
  - `seo_description`: Meta description
  - `is_active`: Status flag
  - Self-Relations:
    - `parent Category?`
    - `children Category[]`
  - Relation: `products Product[]` (One-to-Many)

- **Product (`products`)**:
  - `id`: Auto-increment integer (Primary Key)
  - `name`: Product title
  - `description`: Detailed markdown / HTML description
  - `price` & `discount_price`: Pricing breakdown
  - `stock`: Inventory count
  - `brand_id`: Foreign key referencing `Brand`
  - `category_id`: Foreign key referencing `Category`
  - `images`: Image URL array
  - `is_active`: Publication status

---

## 📡 Key API Endpoints

### 🏷️ Admin Brand Management (`/api/admin/brands`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/brands` | Fetch paginated list of brands with search & filter |
| `POST` | `/api/admin/brands` | Create a new brand (`name`, `seo_title`, `seo_description`) |
| `PUT` | `/api/admin/brands/:id` | Update an existing brand |
| `PATCH` | `/api/admin/brands/:id/status` | Toggle brand active/inactive status |
| `DELETE` | `/api/admin/brands/:id` | Soft-delete brand |

### 📂 Admin Category Management (`/api/admin/categories`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/categories` | Fetch category tree / list with parent & subcategory hierarchy |
| `POST` | `/api/admin/categories` | Create category or subcategory (`name`, `parent_id`, `seo_description`) |
| `PUT` | `/api/admin/categories/:id` | Update category details or change parent category |
| `PATCH` | `/api/admin/categories/:id/status` | Toggle category active/inactive status |
| `DELETE` | `/api/admin/categories/:id` | Soft-delete category |

### 🧸 Product Catalog & Admin (`/api/products` & `/api/admin/products`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | Browse active catalog with brand & category search, sort & filters |
| `GET` | `/api/products/:id` | Fetch product details including joined `brand` and `category` tree |
| `POST` | `/api/admin/products` | Create product with image uploads, `brand_id`, and `category_id` |
| `PUT` | `/api/admin/products/:id` | Update product information |
| `DELETE` | `/api/admin/products/:id` | Remove product |

### 🔐 Auth & Account (`/api/auth` & `/api/account`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register new user account |
| `POST` | `/api/auth/login` | Login user, issues JWT access token |
| `POST` | `/api/auth/send-otp` | Generate and dispatch OTP via email |
| `POST` | `/api/auth/verify-otp` | Verify OTP code |

---

## 🛡️ Error Handling & Reliability

- Global unhandled promise rejection and uncaught exception guards implemented in `app.js` to safeguard server uptime.
- Standardized JSON responses across all controllers:
  ```json
  {
    "success": true,
    "message": "Operation successful",
    "data": { ... }
  }
  ```
- Error response schema:
  ```json
  {
    "success": false,
    "message": "Error description details"
  }
  ```

---

## 📜 Available Scripts

| Command | Action |
|---|---|
| `npm start` | Starts Express server using `node app.js` |
| `npm run dev` | Runs development server with Nodemon auto-restart |
| `npm run prisma:generate` | Updates Prisma Client after schema changes |
| `npm run prisma:push` | Synchronizes `schema.prisma` directly into PostgreSQL |
| `npm run prisma:studio` | Launches Prisma Studio GUI for database records |
