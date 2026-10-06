# CourierGo UI/UX redesign notes

## Before going live
- `src/config/landing.ts`: STATS and TESTIMONIALS are placeholders. Replace with real, verifiable numbers and customer quotes.
- Hero/how-it-works/tracking panels use demo data (parcel CG-48213, rider names). These are illustrations, not API data.

## What changed
- Design tokens: deep ink navy (`bg-ink`) alongside the brand orange; motion primitives in `globals.css` (all respect prefers-reduced-motion).
- Landing (12 sections): hero with live route animation, trust strip, services, role-based animated how-it-works, tracking showcase, features, roles, pricing estimator, hub network, testimonials, FAQ, CTA.
- Header (scroll-aware), footer, login/register shell, inner page headings, services page.
- Dashboard: topbar with page title and quick actions, softer cards, larger stat numbers, dark hero on customer/rider/admin overviews, sidebar active indicator, page fade on navigation, refreshed shipment list, numbered booking stepper, auth headings and buttons.

## Verified
`npx tsc --noEmit`, `npx biome check src`, `npx next build` all pass.
`npm run test:ui` needs the backend API running.

## Round 3
- Shipment detail and public tracking share a dark `ShipmentHeader` with animated progress (active step pulses) and a pulsing latest timeline event.
- Global: table header/cell style, filter pills, empty states, rounded-2xl across admin/payment/hub/rider lists, selectable parcel-type cards in the booking wizard.
- Pages: About (animated network steps), hub cards, 404 and payment result screens.
- Production: security headers (next.config.ts), robots.txt, sitemap.xml. Dashboard routes are disallowed for crawlers.
- Demo tracking code on the landing page is now `CR-2026-048213` to match the real code format.

## Round 4 (completes the redesign)
- UI primitives: button (soft primary glow), input/textarea/select (subtle shadow + hover border), dialog (rounded-2xl, blurred ink overlay, roomier footer), OTP slots (larger rounded boxes), alert, popover.
- Auth: forgot/reset/verify/rider-apply now match login/register (left-aligned 3xl heading, h-11 glow button); verify screen has an animated icon chip.
- Profile & vehicle pages: dark hero with an identity summary (`profile-summary.tsx`), avatar uploader panel.
- Booking wizard: all four steps share the same button sizes.
- Rider overview: availability panel with a live online indicator.
- Admin overview: donut with total in the centre, per-bar revenue colours, styled tooltips.
- Shared: error state, route line, search input, access-denied, auth-loading, error pages, track loading, user menu, recent-shipments header, pay button, add-note panel.

## Still plain on purpose
- `src/api`, `hooks`, `validation`, `routes`, `utils`, `lib`, `proxy.ts`: no UI, untouched.
- Status badge colours (`constants/shipment.constant.ts`) already looked right and were kept.

## Not verified
No browser was available in any round, so animation timing and breakpoints were not checked visually. Run `npm run dev` and review 375px, 768px and 1280px widths before launch.

Round 4 was written without `node_modules`, so only a syntax check was run. Run `npx tsc --noEmit`, `npx biome check src --write` (formatting) and `npx next build` before merging.
