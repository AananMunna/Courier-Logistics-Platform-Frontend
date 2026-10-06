# CourierGo — Courier & Logistics Platform (Frontend)

Production-oriented Next.js frontend for the **Courier & Logistics Platform** backend.
Three fixed roles — **Customer**, **Rider**, **Admin** — plus a public parcel-tracking site.

## Stack

Next.js 16 (App Router, React Compiler) · TypeScript (strict) · Tailwind CSS 4 · shadcn/ui on Base UI ·
TanStack Query · TanStack Form + Zod · Recharts · Sonner-style toasts · bKash (via backend)

## Quick start

```bash
cp .env.example .env.local      # set BACKEND_URL to your running backend
npm install
npm run dev                     # http://localhost:3000
```

Build: `npm run build && npm start` · Typecheck: `npm run typecheck` · Lint/format: `npm run lint`

### Backend settings that must match

| Backend `.env`  | Value |
| --------------- | ----- |
| `FRONTEND_URL`  | URL of this site (bKash redirects the customer to `FRONTEND_URL/payment/success` or `/payment/failure`) |
| Seeded accounts | `admin@courier.com / Admin@123`, `customer@courier.com / Customer@123`, `rider@courier.com / Rider@123` (used by the one-click demo buttons; override with `NEXT_PUBLIC_DEMO_*`) |

**How API calls work:** the browser calls `/api/v1/*` on *this* origin and `next.config.ts` rewrites it to
`BACKEND_URL`. Auth cookies therefore stay first-party (no CORS, no third-party-cookie blocking) and
`src/proxy.ts` can read the session cookie for instant, flash-free route protection.
To call the backend directly instead, set `NEXT_PUBLIC_API_BASE_URL` to the absolute URL (route protection then
falls back to the client guards only).

## Pages (36 routes)

| Area | Routes |
| ---- | ------ |
| Public | `/` `/services` `/pricing` (fee calculator + FAQ) `/hubs` `/track` `/about-us` `/contact` |
| Auth | `/login` (one-click demo for all 3 roles) `/register` `/register/verify-account` `/apply` (rider) `/apply/verify-account` `/forgot-password` `/reset-password` |
| Payment | `/payment/success` `/payment/failure` `/payment/cancel` |
| Customer `/dashboard` | overview · `shipments` · `shipments/new` (4-step wizard) · `shipments/[id]` · `payments` · `profile` |
| Rider `/rider` | today · `shipments` · `shipments/[id]` · `earnings` · `profile` (vehicle & availability) |
| Admin `/admin` | overview (charts) · `shipments` · `shipments/[id]` · `approve-rider` · `hubs` · `payments` · `users` · `audit-logs` |
| Utility | custom `not-found`, global + dashboard `error.tsx`, `loading.tsx` skeletons |

## Role workflows (kept deliberately short)

- **Customer:** *Send a parcel* → 4 short steps (pickup → receiver → parcel → review, fee shown before confirming) →
  shipment page with a single **Pay with bKash** button (or COD) → live timeline. Cancel is available until pickup.
- **Admin:** dashboard banners surface the two things that need action — *riders awaiting approval* and
  *shipments needing a rider*. Assign a rider from the shipment page in one dialog.
- **Rider:** one big action button per parcel that follows the backend's status rules
  (Picked up → In transit → Out for delivery → Delivered; "Report problem" asks for a reason). COD reminder on delivery.

## Backend API coverage

All endpoints in the backend are wired in `src/api/*` and exposed through hooks in `src/hooks/*`:
auth (register, verify, rider register/verify, login, logout, refresh, me, Google, forgot/reset/change password),
users (me, profile image upload with progress, list, block/unblock), riders (list, verify, me, update me, assigned
shipments, earnings), hubs (CRUD), shipments (create, mine, all, detail, public track, assign, status, cancel, delete),
tracking (timeline, note), payments (initiate, refund, mine, all, by shipment), analytics (admin, customer, rider, audit logs).
Silent token refresh (single-flight) happens in `src/lib/apiClient.ts`.

## Structure

```
src/
  app/            routes — (public)/(marketing), (public)/(authentication), (dashboard)/{admin,rider,dashboard}, payment
  api/            one file per backend module
  hooks/          TanStack Query hooks, useUrlState (filters/sort/search/page in the URL), useDebounce
  components/
    ui/           shadcn/Base UI primitives
    shared/       StatCard, EmptyState, ErrorState, status badges, timeline, dialogs, form fields, skeletons
    modules/      feature UI (shipments, payments, admin, rider, profile, tracking, homepage…)
    form/         auth forms        auth/  guards       layout/  shells, header, footer
  config/ constants/ types/ validation/ utils/ lib/ routes/ providers/
  proxy.ts        role-based route protection
```

## Quality notes

- All lists keep filters, search, sort and page in the URL (`?status=DELIVERED&page=2`) and are shareable.
- Skeletons for every data page (`loading.tsx` + in-component), meaningful empty states, inline error states with retry,
  toast on every mutation failure. Server Components by default; `"use client"` only where needed.
- Mobile-first: card lists on phones / tables on desktop, thumb-sized rider actions, native selects.
- Contact form opens the visitor's mail app (the backend has no contact endpoint).
- Payments: the backend integrates **bKash** (tokenized checkout), so that is the gateway used here.

## Deploying (read this before going live)

1. **`BACKEND_URL` and `NEXT_PUBLIC_*` are baked in at build time** (Next.js compiles rewrites into the build).
   Set them in your host's environment *before* `next build`; changing them later needs a rebuild.
2. **Backend `FRONTEND_URL`** must equal this site's public URL (bKash redirects the customer there).
3. **Backend rate limiter** (`express-rate-limit`, 300 req / 15 min / IP): the backend does not set `trust proxy`, so behind a
   proxy/Vercel every visitor can share ONE bucket. Add `app.set("trust proxy", 1)` in the backend and raise the limit
   (e.g. 300 → 1000+, or only limit `/auth/*`) before real traffic.
4. **Payments:** bKash is sandbox until you put production credentials on the backend.
5. Optional Google sign-in needs `NEXT_PUBLIC_GOOGLE_CLIENT_ID` (frontend) and `GOOGLE_CLIENT_ID` (backend) to match.

## Known backend issues the frontend works around

| Backend behaviour | What the frontend does |
| ----------------- | ---------------------- |
| `GET /payments/my-payments` ignores `?status=` | Customer payments are loaded once and filtered/paginated client-side |
| `PATCH /users/me` rejects an empty `contactNumber` | Empty phone is omitted from the request |
| Tracking codes are case-sensitive | Track form and URL upper-case the code |
| `PATCH /riders/:id/verify` is single-use (REJECTED can't be approved later) | Approve/Reject buttons only appear on PENDING applications |
| Multer/Cloudinary errors are returned as HTTP 500 | Upload errors show a friendly toast |

## Tests

`npm run test:api` (~110 real-API checks) and `npm run test:ui` (20 component flows) — see `e2e/README.md`.
