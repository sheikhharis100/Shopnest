# ShopNest

A full-stack MERN e-commerce store — product catalog with search, filtering and pagination, a persistent cart, JWT authentication, a simulated card checkout, and an admin dashboard for managing products, orders and users.

**Live demo:** [shopnest-five-umber.vercel.app](https://shopnest-five-umber.vercel.app)

**Demo admin login:** `admin@shopnest.com` / `admin123` (created by the seed endpoint)

---

## Tech stack

**Frontend**

| | |
|---|---|
| React 19 | UI library |
| Vite 7 | Dev server and build tool |
| Redux Toolkit 2 | State for cart, auth and orders |
| React Router 7 | Client-side routing |
| Tailwind CSS 3 | Styling, with a custom brand palette |
| Axios | HTTP client, with a JWT request interceptor |
| React Icons | Icon set |

**Backend**

| | |
|---|---|
| Node.js | Runtime (ES modules) |
| Express 5 | HTTP framework |
| MongoDB + Mongoose 9 | Database and ODM |
| JSON Web Tokens | Stateless auth, 30-day expiry |
| bcryptjs | Password hashing |
| Multer + Cloudinary | Admin product image uploads |
| CORS, dotenv | Cross-origin access, config |

---

## Features

**Storefront**
- Product grid with keyword search, category filter and pagination (12 per page)
- Product detail pages with ratings and customer reviews
- Cart that survives a page refresh (persisted to `localStorage`)
- Register / login, with the session restored on reload
- Three-step checkout: shipping address → payment method → review
- Simulated card payment, then an order confirmation page
- Order history on the profile page

**Admin**
- Dashboard with totals for orders, users, products and revenue, plus recent orders
- Product CRUD, including Cloudinary image upload
- Order list with status updates and delivery marking
- User list with edit and delete

---

## Getting started

### Prerequisites

- Node.js 18 or newer
- A MongoDB database — either a local `mongod` or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- A [Cloudinary](https://cloudinary.com) account (optional — only needed for admin image uploads)

### 1. Clone and install

```bash
git clone https://github.com/sheikhharis100/Shopnest.git
cd Shopnest

cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure the backend

Copy the example file and fill it in:

```bash
cd backend
cp .env.example .env
```

| Variable | Required | Notes |
|---|---|---|
| `MONGO_URI` | yes | Connection string, e.g. `mongodb://127.0.0.1:27017/shopnest` |
| `JWT_SECRET` | yes | Any long random string |
| `PORT` | no | Defaults to `5000` |
| `CLOUDINARY_CLOUD_NAME` | no | Needed only for image uploads |
| `CLOUDINARY_API_KEY` | no | Needed only for image uploads |
| `CLOUDINARY_API_SECRET` | no | Needed only for image uploads |
| `ALLOW_SEED` | no | Must be `true` to enable the seed endpoint. Off unless set. See the warning below. |

### 3. Configure the frontend

```bash
cd frontend
cp .env.example .env
```

| Variable | Required | Notes |
|---|---|---|
| `VITE_API_URL` | no | Backend base URL with no trailing slash and no `/api` suffix. Defaults to `http://localhost:5000`. |

### 4. Run both servers

In one terminal:

```bash
cd backend
npm run dev     # nodemon on http://localhost:5000
```

In another:

```bash
cd frontend
npm run dev     # Vite on http://localhost:5173
```

### 5. Seed the database

With `ALLOW_SEED=true` set, visit <http://localhost:5000/api/seed> once. This creates 14 demo products and the admin account above.

> **Warning:** `GET /api/seed` **deletes every user and product** before inserting the demo data. It is deny-by-default and only runs when `ALLOW_SEED=true`, so never set that variable on a deployed environment.

---

## Scripts

**backend**

| Command | Description |
|---|---|
| `npm run dev` | Start with nodemon and auto-reload |
| `npm start` | Start once, for production |

**frontend**

| Command | Description |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the built output locally |
| `npm run lint` | ESLint over the source |

---

## API reference

All routes are prefixed with `/api`. Protected routes expect an `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Create an account, returns a token |
| `POST` | `/auth/login` | Public | Log in, returns a token |
| `GET` | `/auth/profile` | Private | Current user |

### Products

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/products` | Public | Paginated list. Query: `page`, `keyword`, `category` |
| `GET` | `/products/top` | Public | Four highest-rated products |
| `GET` | `/products/:id` | Public | Single product |
| `GET` | `/products/stats` | Admin | Dashboard totals and recent orders |
| `POST` | `/products` | Admin | Create |
| `PUT` | `/products/:id` | Admin | Update |
| `DELETE` | `/products/:id` | Admin | Delete |
| `POST` | `/products/:id/reviews` | Private | Add a review (one per user) |

### Orders

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/orders` | Private | Create an order |
| `GET` | `/orders/mine` | Private | Current user's orders |
| `GET` | `/orders/:id` | Private | Single order |
| `GET` | `/orders` | Admin | All orders |
| `PUT` | `/orders/:id/pay` | Private | Mark paid |
| `PUT` | `/orders/:id/deliver` | Admin | Mark delivered |
| `PUT` | `/orders/:id/status` | Admin | Set status |

### Users

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/users/profile` | Private | Current user |
| `PUT` | `/users/profile` | Private | Update name, email or password |
| `GET` | `/users` | Admin | List users |
| `GET` | `/users/:id` | Admin | Single user |
| `PUT` | `/users/:id` | Admin | Update a user |
| `DELETE` | `/users/:id` | Admin | Delete a user |

### Uploads

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/upload` | Admin | Upload a product image to Cloudinary (`image` form field) |

---

## Project structure

```
Shopnest/
├── backend/
│   ├── config/db.js            # Mongoose connection
│   ├── controllers/            # Route handlers
│   ├── middleware/             # protect + admin guards
│   ├── models/                 # User, Product, Order schemas
│   ├── routes/                 # Express routers
│   ├── utils/                  # JWT helper, Cloudinary storage
│   └── server.js               # App entry point
└── frontend/
    ├── src/
    │   ├── components/         # Navbar, Footer, ProductCard, guards…
    │   ├── pages/              # Storefront pages
    │   │   └── admin/          # Admin dashboard pages
    │   ├── redux/
    │   │   ├── slices/         # cart, auth, order
    │   │   └── store.js
    │   └── utils/api.js        # Axios instance + auth interceptor
    └── vercel.json             # SPA rewrite so deep links resolve
```

---

## Deployment

**Frontend (Vercel)** — set the root directory to `frontend` and add `VITE_API_URL` pointing at the deployed backend. The included `vercel.json` rewrites all paths to `index.html` so routes like `/product/:id` survive a refresh.

**Backend (Render)** — the repo ships a `render.yaml` blueprint. In Render choose **New → Blueprint**, point it at this repo, and fill in `MONGO_URI` (and the Cloudinary keys if you want uploads); `JWT_SECRET` is generated for you.

Setting it up by hand instead? The root directory **must** be `backend`. The repo root has its own `package.json` with no `start` script, so Render's autodetect builds from there and the deploy fails. Use:

| Setting | Value |
|---|---|
| Root directory | `backend` |
| Build command | `npm ci` |
| Start command | `npm start` |
| Health check path | `/` |

Render injects its own `PORT`, which `server.js` already reads. Leave `ALLOW_SEED` unset — the seed route is deny-by-default and returns 403 without it.

> On Render's free plan the service sleeps after inactivity, so the first request following an idle period can take ~50 seconds. If the storefront looks like it's hanging on load, that's usually why.

---

## Notes and limitations

- **Payment is simulated.** The checkout collects card details, discards them, and marks the order paid. No real payment processor is wired up, so do not enter real card numbers.
- **CORS is fully open** (`app.use(cors())`). Restrict it to your frontend origin before running this anywhere real.
- There is no rate limiting on the auth routes.
