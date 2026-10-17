# CourierGo – Courier & Logistics Platform (Frontend)

A web app for booking, delivering and tracking parcels. It talks to a separate REST API (the backend repo) and has three kinds of users: customers, riders and admins. There is also a public page where anyone can track a parcel with its tracking code.

- **Live site:** https://couriergo.vercel.app/
- **Backend API:** https://courier-logistics-platform-backend.vercel.app/

## Demo accounts

The login page has one-click buttons for these, so you don't need to type anything.

| Role     | Email                 | Password       |
| -------- | --------------------- | -------------- |
| Admin    | admin@courier.com     | Admin@123      |
| Customer | customer@courier.com  | Customer@123   |
| Rider    | rider@courier.com     | Rider@123      |

These are demo accounts only. Please don't enter real personal data.

## What each role can do

**Customer**
- Book a parcel in four short steps (pickup, receiver, parcel details, review). The delivery fee is shown before you confirm.
- Pay with bKash or choose cash on delivery.
- Follow each shipment on a timeline, and cancel it until it has been picked up.
- See payment history and edit the profile and photo.

**Rider**
- Apply to become a rider; an admin has to approve the application first.
- See assigned parcels and move each one forward: picked up, in transit, out for delivery, delivered. A problem can be reported with a reason.
- Check earnings, set availability, and edit vehicle details.

**Admin**
- Dashboard with totals and charts, plus a queue of things that need action (parcels without a rider, rider applications, failed deliveries).
- Assign riders to shipments, approve or reject rider applications.
- Manage hubs, users (block/unblock) and payments, and read the audit log.

**Public**
- Landing page, services, pricing with a fee calculator, hub list, about and contact pages, and parcel tracking.

## Tech used

- Next.js (App Router) with TypeScript
- Tailwind CSS and shadcn/ui components
- TanStack Query for data fetching, TanStack Form with Zod for forms
- Recharts for charts
- bKash payments, handled by the backend

## Running it locally

You need Node.js 20 or newer and the backend running somewhere (locally or the live one).

```bash
git clone https://github.com/AananMunna/Courier-Logistics-Platform-Frontend.git
cd Courier-Logistics-Platform-Frontend
npm install
cp .env.example .env.local
```

Open `.env.local` and set `BACKEND_URL` to the backend address, for example `http://localhost:5000` or the live backend URL above. Then:

```bash
npm run dev
```

The app opens at http://localhost:3000.

Other scripts: `npm run build`, `npm start`, `npm run typecheck`, `npm run lint`.

### Environment variables

| Variable | What it is for |
| -------- | -------------- |
| `BACKEND_URL` | Address of the backend. Requests to `/api/v1/*` are forwarded here. |
| `NEXT_PUBLIC_API_BASE_URL` | Keep as `/api/v1` unless you want the browser to call the backend directly. |
| `NEXT_PUBLIC_SITE_URL` | Public URL of this site. |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Optional. Without it the Google sign-in button is hidden. |
| `NEXT_PUBLIC_DEMO_*` | Optional. Credentials for the one-click demo login buttons. |
| `ANTHROPIC_API_KEY` | Optional. Turns on the AI assistant. Server-side only; set it before building. |
| `ASSISTANT_MODEL` | Optional. Model used by the assistant (default `claude-haiku-5-5`). |

The full list is in `.env.example`.

## AI assistant

Public pages show a chat button (bottom right) when `ANTHROPIC_API_KEY` is set. The assistant answers questions about booking, fees, payments, cancelling and hubs using the site's own pricing and FAQ config, can look up a parcel by tracking code, and can calculate a delivery fee. It cannot book, pay or cancel anything. Parcel addresses are never passed to the model.

The route is `src/app/api/assistant/route.ts`. It accepts at most 12 messages of 500 characters and allows 20 requests per IP every 10 minutes. That limit is kept in memory per server instance, so use a shared store such as Redis if you need a strict cap.

## How API calls work

The browser calls `/api/v1/...` on the same site, and `next.config.ts` forwards those requests to `BACKEND_URL`. This keeps the login cookies first-party, so there are no CORS or cookie-blocking problems, and `src/proxy.ts` can read the session cookie to protect routes. An expired access token is refreshed quietly in `src/lib/apiClient.ts`.

## Project structure

```
src/
  app/          pages and layouts
  api/          one file per backend module
  hooks/        data hooks and small helpers (URL state, debounce)
  components/   ui primitives, shared pieces, and feature modules
  config/ constants/ types/ validation/ utils/ lib/ routes/ providers/
  proxy.ts      role-based route protection
e2e/            API and UI tests
```

## Deploying

The site runs on Vercel. A few things to know:

1. `BACKEND_URL` and every `NEXT_PUBLIC_*` variable are read at build time. Set them before building, and rebuild after changing them.
2. The backend's `FRONTEND_URL` must match this site's URL, because bKash sends the customer back to `/payment/success` or `/payment/failure`.
3. bKash runs in sandbox mode until production credentials are added to the backend.

## Known backend quirks

Things I had to work around on the frontend:

| Backend behaviour | How the frontend handles it |
| ----------------- | --------------------------- |
| `GET /payments/my-payments` ignores the `status` filter | Payments are loaded once and filtered on the client |
| `PATCH /users/me` rejects an empty phone number | An empty phone is left out of the request |
| Tracking codes are case-sensitive | The code is converted to upper case before searching |
| Rider verification can only be done once | Approve/Reject only show for pending applications |
| Upload errors come back as HTTP 500 | A friendly error message is shown instead |

## Tests

`npm run test:api` runs checks against a real backend, and `npm run test:ui` runs component tests. Setup details are in `e2e/README.md`.


