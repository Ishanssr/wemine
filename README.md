# Wemine — Premium Ecommerce Platform

![Wemine](https://via.placeholder.com/1200x600/f4f9f9/1a1a1a?text=Wemine+Premium+Mountain+Wear)

A production-ready, enterprise-grade ecommerce platform built with Next.js 15, NestJS, PostgreSQL, and Prisma. Glacier-blue glassmorphism aesthetic with complete backend architecture.

## Tech Stack

**Frontend:** Next.js 15, TypeScript, TailwindCSS, Framer Motion, Zustand, TanStack Query
**Backend:** NestJS, PostgreSQL, Prisma ORM, Redis, JWT, Passport.js
**Payments:** Stripe, Razorpay
**Deployment:** Docker, Vercel (frontend), Railway/Render/AWS (backend)

## Quick Start

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 16+
- Redis 7+

### Local Development (Without Docker)

**Backend:**
```sh
cd backend
npm install
cp .env .env.local  # Edit with your values
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

**Frontend:**
```sh
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

### Docker (Full Stack)
```sh
docker compose up -d
```

This starts PostgreSQL, Redis, backend (port 4000), and frontend (port 3000).

### Seed Data
```sh
cd backend
npx prisma db seed
```

**Credentials:**
- Admin: `admin@wemine.com` / `admin123`
- User: `user@wemine.com` / `admin123`

## Project Structure

```
wemine/
├── backend/                  # NestJS API
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema (20+ models)
│   │   └── seed.ts           # Seed script
│   └── src/
│       ├── auth/             # JWT, OAuth, 2FA, OTP
│       ├── products/         # CRUD, variants, images
│       ├── orders/           # Orders, refunds
│       ├── cart/             # Cart, save for later
│       ├── payments/         # Stripe, Razorpay
│       ├── admin/            # Dashboard, management
│       ├── search/           # Full-text search
│       ├── users/            # Profiles, addresses
│       ├── categories/       # Category hierarchy
│       ├── reviews/          # Ratings & reviews
│       ├── wishlist/         # User wishlists
│       ├── coupons/          # Discount engine
│       ├── notifications/    # User notifications
│       ├── upload/           # File uploads
│       ├── email/            # Transactional emails
│       └── loyalty/          # Loyalty points
├── frontend/                 # Next.js 15 App
│   └── src/
│       ├── app/              # App Router pages
│       │   ├── products/     # Product listing
│       │   ├── product/      # Product detail
│       │   ├── cart/         # Shopping cart
│       │   ├── checkout/     # Multi-step checkout
│       │   ├── auth/         # Login, signup, OAuth
│       │   ├── account/      # Profile, orders, wishlist
│       │   └── admin/        # Admin dashboard
│       ├── components/       # Reusable components
│       ├── store/            # Zustand stores
│       └── lib/              # API client, utils
└── docker-compose.yml        # Full stack orchestration
```

## Features

### Auth System
- Email/password signup & login
- OAuth (Google, GitHub)
- Email verification (OTP)
- Password reset flow
- JWT access + refresh tokens
- 2FA support
- Session management

### Product System
- Product variants (size/color)
- Dynamic inventory
- Category hierarchy
- Product images gallery
- Related products
- Flash sales support
- SEO metadata
- SKU management

### Cart & Checkout
- Persistent cart
- Save for later
- Quantity management
- Coupon/discount engine
- Multi-address support
- Stripe & Razorpay
- Tax & shipping calculation
- Order confirmation

### Admin Dashboard
- Sales analytics
- Revenue tracking
- User management
- Inventory management
- Order management
- Refund processing

### Search
- Debounced instant search
- Typo-tolerant
- Price & category filters
- Search suggestions
- Search history

## Environment Variables

### Backend (.env)
| Variable | Description |
|----------|-------------|
| DATABASE_URL | PostgreSQL connection string |
| REDIS_URL | Redis connection string |
| JWT_ACCESS_SECRET | JWT signing key |
| JWT_REFRESH_SECRET | Refresh token key |
| STRIPE_SECRET_KEY | Stripe API key |
| RAZORPAY_KEY_ID | Razorpay API key |
| SMTP_HOST | Email server host |
| GOOGLE_CLIENT_ID | Google OAuth client ID |
| GITHUB_CLIENT_ID | GitHub OAuth client ID |

### Frontend (.env.local)
| Variable | Description |
|----------|-------------|
| NEXT_PUBLIC_API_URL | Backend API URL |

## Deployment

### Frontend (Vercel)
```sh
cd frontend
npx vercel --prod
```

### Backend (Railway/Render)
```sh
cd backend
# Set DATABASE_URL, JWT secrets, payment keys in dashboard
npm run build
npm run start:prod
```

### Database Migrations
```sh
npx prisma migrate deploy    # Production
npx prisma migrate dev        # Development
```

## API Endpoints

### Auth
- `POST /api/auth/signup` — Create account
- `POST /api/auth/login` — Sign in
- `POST /api/auth/refresh` — Refresh tokens
- `POST /api/auth/logout` — Sign out
- `POST /api/auth/send-otp` — Email verification
- `POST /api/auth/verify-email` — Verify OTP
- `POST /api/auth/forgot-password` — Reset request
- `POST /api/auth/reset-password` — Reset password
- `GET /api/auth/profile` — Get profile
- `PATCH /api/auth/profile` — Update profile
- `GET /api/auth/google` — Google OAuth
- `GET /api/auth/github` — GitHub OAuth

### Products
- `GET /api/products` — List products (search, filter, sort, paginate)
- `GET /api/products/featured` — Featured products
- `GET /api/products/:slug` — Product by slug
- `GET /api/products/:id/related` — Related products
- `POST /api/products` — Create (admin/vendor)
- `PUT /api/products/:id` — Update (admin/vendor)
- `DELETE /api/products/:id` — Delete (admin)

### Cart
- `GET /api/cart` — Get cart
- `POST /api/cart/items` — Add item
- `PATCH /api/cart/items/:id` — Update quantity
- `DELETE /api/cart/items/:id` — Remove item
- `DELETE /api/cart` — Clear cart

### Orders
- `POST /api/orders` — Create order
- `GET /api/orders` — List user orders
- `GET /api/orders/:id` — Order detail
- `POST /api/orders/:id/refund` — Request refund

### Payments
- `POST /api/payments/stripe/create-intent/:orderId` — Stripe payment
- `POST /api/payments/stripe/webhook` — Stripe webhook
- `POST /api/payments/razorpay/create-order/:orderId` — Razorpay
- `POST /api/payments/razorpay/verify` — Verify payment

### Admin
- `GET /api/admin/dashboard` — Dashboard stats
- `GET /api/admin/users` — List users
- `GET /api/admin/orders` — List orders
- `PUT /api/admin/orders/:id/status` — Update order status
- `POST /api/admin/refunds/:id/:action` — Approve/reject refund

### Search
- `GET /api/search?q=query` — Search products
- `GET /api/search/recent` — Recent searches
- `DELETE /api/search/history` — Clear history

## Design System

The UI follows a premium glacier-glassmorphism aesthetic:
- **Colors:** Glacier blue palette (#F4F9F9 → #1A2C2E)
- **Typography:** Outfit (headings) + Manrope (body)
- **Effects:** Glass surfaces, backdrop blur, subtle shadows
- **Animations:** Framer Motion with smooth transitions
- **Responsive:** Mobile-first, pixel-perfect

## License
MIT
