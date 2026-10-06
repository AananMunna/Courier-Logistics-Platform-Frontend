# CourierGo — UI/UX redesign: handoff & progress tracker

> **If you are a new Claude session reading this:** this file is the single source of truth.
> Read it fully, then continue from **Section 6 (Remaining work)**, top to bottom, ticking boxes
> in **Section 7 (Progress log)** as you finish each task. Do not redo anything marked DONE.
> After each task, update this file before moving on (the previous account ran out of usage mid-way).

---

## 1. Project in one paragraph
CourierGo is a Bangladesh courier/parcel platform (Next.js frontend only; backend API is separate).
Roles: `CUSTOMER`, `RIDER`, `ADMIN`, `SUPER_ADMIN` (admins share one dashboard). Payments: bKash + cash on
delivery (COD). Shipments move through hubs (origin hub -> destination hub). Tracking codes look like
`CR-2026-048213`. Currency is BDT (৳). The owner (a Bengali speaker, writes Banglish) wants it to feel like a
real, trustworthy, premium product ("প্রথমে দর্শনধারী পরে গুণবিচারী": first impression matters).

## 2. The owner's original brief (verbatim intent)
1. Landing page must feel like a premium, popular courier-service landing page; build user trust on first visit;
   pixel-perfect responsive; micro-animations; animations that show how the platform works and how each role works;
   **10–12 sections minimum**; then other nav pages (services, pricing, hubs, about, contact, track) and login/register.
2. Dashboard must feel trusted, premium, super fast and very clean — per role.
3. Reference real couriers (DHL, FedEx, Pathao, Uber-style tracking, etc.), deliver a production-ready final zip.
Owner's working style: replies in Banglish (Bengali in Latin letters). Answer in the same style, be honest about
what is verified vs not, and never claim "complete" unless every box in Section 7 is ticked.

## 3. Tech stack & hard rules
- Next.js **16.3.4** (App Router, React **19.2.8**, React Compiler babel plugin), TypeScript, Tailwind CSS **v4**
  (`@import "tailwindcss"`, tokens in `src/app/globals.css` via `@theme inline`).
- UI primitives: `@base-ui/react` wrapped shadcn-style in `src/components/ui/*` (NOT Radix). Use `render={<Link/>}`
  pattern, `data-open`, `data-checked` attributes (see existing files).
- Data: TanStack Query (`src/hooks/*`, keys in `src/lib/query-keys.ts`), TanStack Form + Zod 4, `ofetch` client in
  `src/lib/apiClient.ts`, charts = `recharts` v3, icons = `lucide-react` v1, fonts = Geist.
- Lint/format = **Biome 2.4.2** (`npx biome check src --write`). No ESLint/Prettier.
- `AGENTS.md` says this Next.js has breaking changes: read `node_modules/next/dist/docs/` before using any Next API
  you are unsure about. (`node_modules` is NOT in the zip: run `npm install` first.)
- **No new npm dependencies** unless unavoidable (the previous sandbox had no network). The command palette, theme
  toggle, bottom tab bar etc. in Section 6 are specified to be built with what is already installed.
- No `localStorage` restriction exists here (this is a normal Next app, not a Claude artifact), but guard with
  `typeof window` / `useEffect` to avoid hydration mismatch.
- Motion must respect `prefers-reduced-motion` (globals.css already forces this; keep using the `cg-*` classes).

## 4. Design language (follow exactly — this is what "already redesigned" looks like)
Tokens (globals.css): brand orange `--primary` (oklch 0.56 0.205 38), deep navy **`bg-ink` / `text-ink-foreground` /
`ink-muted`**, radius base `0.75rem`; dark-mode tokens exist under `.dark` (there is NO theme toggle yet).
Motion utilities (globals.css): `cg-marquee, cg-ping, cg-float, cg-travel, cg-dash, cg-fill, cg-pop, cg-fade,
cg-reveal (+data-in), cg-grid-bg, cg-grid-ink`. Wrappers: `components/motion/reveal.tsx`, `count-up.tsx`.

Conventions to copy:
- Cards: `rounded-2xl`, `ring-1 ring-foreground/[0.07]`, soft shadow (already in `ui/card.tsx`).
- Hero panels: `rounded-3xl bg-ink text-ink-foreground`, `cg-grid-ink` masked overlay + blurred `bg-primary/30` orb
  (see `components/shared/dashboard-hero.tsx`; props `title, description, actions, aside`).
- Icon chips: `rounded-xl|2xl bg-primary/10 text-primary` (+ `ring-8 ring-primary/5` for big empty/error states).
- Primary CTA buttons: `h-11 text-base shadow-[0_10px_24px_-12px_var(--primary)]` (default Button variant now has a
  glow already). Secondary: `variant="outline"`. Pills in toolbars: `rounded-full`.
- Headings: auth = left aligned `text-3xl font-bold tracking-tight`; page titles `text-2xl md:text-3xl font-semibold`.
- Tables: header `bg-muted/40 text-xs text-muted-foreground`, wrapper `overflow-hidden rounded-2xl border bg-card`.
  **Mobile rule: below `md` every data table must be replaced by stacked cards** (pattern: `shipment-list.tsx` renders
  `<ul className="space-y-3 md:hidden">` + `<div className="hidden md:block">` table).
- Layout wrapper for dashboard pages: `PageContainer` + `PageHeader` from `components/shared/page-header.tsx`.
- Status colours live in `constants/shipment.constant.ts` (`SHIPMENT_STATUS[status].badgeClass/dotClass`) — keep.
- Copy tone: short, friendly, plain English (the app is English UI).

## 5. What is DONE (do not redo)
### Round 1–3 (previous account)
- Tokens + motion primitives; landing page with 12 sections (`components/modules/homepage/*`: Hero with live-route
  animation, trust strip, service highlights, role-based animated how-it-works, tracking showcase, features bento,
  roles, pricing teaser/estimator, coverage/hub network, testimonials, FAQ, CTA banner). Content/config in
  `src/config/landing.ts` (STATS + TESTIMONIALS are **placeholders** — replace with real data before launch;
  hero/how-it-works/tracking panels use demo parcel `CR-2026-048213`).
- Public pages: header (scroll-aware), footer, services, pricing (`fee-calculator.tsx`), hubs, about (animated
  network steps), contact, track (`track-form.tsx`, `public-tracking.tsx`), 404, `robots.ts`, `sitemap.ts`,
  security headers in `next.config.ts`.
- Auth: `layout/auth-shell.tsx` (split layout with dark live-route panel), login, register, demo-login.
- Dashboard shell: `dashboard-shell.tsx`, `dashboard-topbar.tsx` (static title + "Track a parcel" + customer-only
  "Send a parcel"), `dashboard-sidebar.tsx` (active indicator bar), `(dashboard)/template.tsx` page fade.
- Overviews: customer / rider / admin each have dark hero + big `StatCard` numbers (`stat-card.tsx`,
  `dashboard-hero.tsx`). Shipment list (`shipment-list.tsx` mobile cards + desktop table, `shipment-list-view.tsx`),
  shipment detail + public tracking share dark `shipment-header.tsx` with animated `shipment-progress.tsx` and
  `shipment-timeline.tsx`. Booking wizard: numbered stepper + selectable parcel-type cards. Payment list/result,
  hub cards, rider earnings view (stat cards only), admin lists restyled (`rounded-2xl`), filter pills, empty states,
  table header/cell style, card softening.
### Round 4 (this file's author, account 2)
- UI primitives: `button` (soft primary glow), `input/textarea/native-select` (shadow + hover border), `dialog`
  (rounded-2xl, ink blurred overlay, roomy footer, `sm:max-w-md`), `input-otp` (large rounded slots), `alert`
  (rounded-2xl), `popover`.
- Auth forms: forgot-password, reset-password, verify-account, rider-apply now match login/register.
- Profile pages (customer + rider): `profile-page.tsx` uses `DashboardHero` with new `profile-summary.tsx`;
  avatar-uploader panel.
- Booking wizard: all 4 steps use `h-11` buttons with glow.
- Rider `availability-toggle.tsx`: live "online" ping indicator (lives inside the dark hero).
- Admin `overview-charts.tsx`: donut with centre total + per-bar revenue colours + styled tooltips.
- Shared polish: error-state, route-line, search-input, access-denied, auth-loading (animated logo), `app/error.tsx`
  + `(dashboard)/error.tsx`, track loading, user-menu, recent-shipments header, pay-button, add-note-form.

## 6. REMAINING WORK (do in this order; each item = one self-contained task)
Audit result: the dashboard is a *reskin* of one shared shell. It still lacks role-specific experience, mobile
navigation, global tools and "speed" features. Implement the tasks below. Keep files small, typed, Biome-clean.

### T1 — Smart topbar (all roles)  `components/dashboard/dashboard-topbar.tsx`
- Title must be correct per role/page (rider `/rider` => "Today", admin `/admin` => "Operations", customer
  `/dashboard` => "Overview"; detail pages => "Shipment details" etc.). Derive from `routes/*` titles instead of the
  hard-coded LABELS map where possible.
- Breadcrumb trail on `md+` (e.g. Shipments / CR-2026-048213) using path segments; plain title on mobile.
- Right side: search/command trigger button (shows `⌘K` hint on md+), theme toggle (T3), role quick action
  (customer: "Send a parcel"; rider: link to active deliveries; admin: "Needs attention" popover — see T9).
### T2 — Mobile bottom tab bar  `components/dashboard/mobile-tab-bar.tsx` (new, rendered in `dashboard-shell.tsx`)
- Visible only `< md`, fixed bottom, blurred `bg-background/90`, safe-area padding (`pb-[env(safe-area-inset-bottom)]`),
  active tab = primary colour + small top indicator. Main content gets `pb-24 md:pb-0`.
- Tabs per role (define in `routes/*.ts` as `mobileTabs`): Rider = Today, Shipments, Earnings, Profile.
  Customer = Overview, Shipments, **New (raised centre button)**, Payments, Profile. Admin = Overview, Shipments,
  Riders, Hubs, **Menu** (opens the existing sidebar sheet via `useSidebar().setOpenMobile(true)`).
### T3 — Theme toggle (light/dark/system)  `components/dashboard/theme-toggle.tsx` + tiny provider
- No `next-themes` dependency. Add an inline script in `app/layout.tsx` `<head>` (before paint) that reads
  `localStorage["cg-theme"]` (+ `prefers-color-scheme`) and toggles `class="dark"` on `<html>` (add
  `suppressHydrationWarning`). Toggle button cycles light/dark. Also place it in the public `Header.tsx`.
- Then sweep for hard-coded light-only colours (`bg-white`, `text-slate-*`, `#hex`) in dashboard components and
  replace with tokens so dark mode is usable. Charts: `STATUS_COLORS` hexes are fine, tooltips already use tokens.
### T4 — Command palette (Cmd/Ctrl+K)  `components/dashboard/command-palette.tsx`
- Built on existing `ui/dialog.tsx` (no cmdk). Sections: "Go to" (all sidebar routes for the role), "Actions"
  (customer: New shipment; admin: Assign riders / Review applications), "Track a parcel" (if the query looks like a
  tracking code `CR-\d{4}-\d{6}` offer "Track CR-…" -> `/track?code=`). Arrow keys + Enter + Esc, focus trap from the
  dialog, `aria-activedescendant` list. Open from topbar button and `Ctrl/Cmd+K`.
### T5 — Rider mobile-first Today screen  `components/modules/rider/rider-overview.tsx`
- Add **"Active delivery" card** above the stats: the rider's current non-final shipment (use `useShipmentList("rider",
  {…})`; pick first with status in picked-up/in-transit/out-for-delivery) showing tracking code, `ShipmentStatusBadge`,
  `RouteLine`, big buttons: **Call receiver** (`tel:`), **Navigate** (`mapsSearchUrl(address)` from utils), **Update
  status** (reuse `StatusActions`). Empty state when none ("No active delivery").
- Larger touch targets (min 44px), thumb-zone layout, sticky availability pill.
- `earnings-view.tsx`: add a recharts **bar chart of earnings per day/week** (derive from the data the hook already
  returns; if only totals exist, derive from delivered shipments list) + "today / this week / total" summary strip.
### T6 — Customer live shipment card  `components/modules/dashboard/customer-overview.tsx` + new `active-shipment-card.tsx`
- Between hero and stats: card for the most recent non-delivered shipment with `ShipmentProgress`, status badge, ETA
  text if available, rider name/phone when assigned, `Pay now` (PayButton) if unpaid, link to details. Empty state
  nudges "Send a parcel". Add a small "Quick book" row (repeat last route) only if data allows.
### T7 — Admin ops queue + trends  `components/modules/admin/*`
- New `ops-queue.tsx` on admin overview: three compact lists with counts — "Needs a rider" (PENDING shipments),
  "Rider applications", "Failed deliveries" — each row links to the right filtered page (use existing query params,
  e.g. `/admin/shipments?status=PENDING`). Replace the two stacked `Alert`s with this panel.
- New trend chart: shipments per day for the last 14 days (derive client-side from `useShipmentList("admin", {limit
  100, sortBy:"createdAt"})` unless an analytics endpoint exists in `src/api/analytics.api.ts` — check first). Area
  chart in `overview-charts.tsx`, with a 7d / 14d / 30d segmented control.
### T8 — Admin tables -> mobile cards  (`user-manager.tsx`, `payment-list-view.tsx`, `hub-manager.tsx`,
  `audit-log-view.tsx`, `rider-approval.tsx`, check `shipment-list-view.tsx`)
- Same pattern as `shipment-list.tsx`: `<ul className="space-y-3 md:hidden">` cards (primary text, status badge,
  2–3 meta lines, action menu/buttons full-width friendly) + existing table in `hidden md:block`. Keep all actions.
### T9 — "Needs attention" popover (admin) and notification feel
- Popover (existing `ui/popover.tsx`) in topbar for ADMIN using `useAdminStats()`: pending riders, pending
  shipments, failed shipments, each linking to its page; red dot on the bell when any > 0. (No notification backend
  exists; this is derived from stats — do not invent an API.) Customers/riders: hide the bell.
### T10 — Perceived speed
- `providers/query.provider.tsx`: sensible `staleTime` (30s lists, 60s stats), `refetchOnWindowFocus` for
  stats/active shipment only, `placeholderData: keepPreviousData` on paginated list hooks so filters/pages don't flash
  skeletons. Prefetch on hover/focus for sidebar + tab-bar links (`router.prefetch`). Keep skeletons that mirror the
  final layout (no layout shift). Optionally optimistic update for rider availability toggle.
### T11 — Final QA pass
- Responsive review at 375 / 768 / 1280 for: landing, auth, each role's overview, shipment list/detail, wizard,
  admin tables, profile. Fix overflow, tap targets, sticky offsets (topbar `h-14`, tab bar height).
- Accessibility: focus-visible rings, `aria-current="page"` on active nav, labels on icon buttons, reduced motion.
- Run the verification commands in Section 8. Update the "Verified / Not verified" block honestly.
- Replace placeholder STATS/TESTIMONIALS in `config/landing.ts` or leave them clearly flagged.

## 7. Progress log (tick when finished AND tell the owner in the chat reply)
Legend: [x] = code written. "Syntax-checked" means ONLY the offline TS1xxx syntax check; nothing has been built or run in a browser.
- [x] T1 Smart topbar — `dashboard/dashboard-topbar.tsx` (role titles, breadcrumb md+, ⌘K button, theme toggle, role quick action)
- [x] T2 Mobile bottom tab bar — `dashboard/mobile-tab-bar.tsx`, `mobileTabs` in `routes/*.ts`, wired in `dashboard-shell.tsx`
- [x] T3 Theme toggle + dark sweep — `dashboard/theme-toggle.tsx`, pre-paint script in `app/layout.tsx`, also in public Header
- [x] T4 Command palette — `dashboard/command-palette.tsx` (Ctrl/Cmd+K, built on `ui/dialog`)
- [x] T5 Rider active-delivery card + earnings chart — `rider/active-delivery-card.tsx`, `rider/earnings-chart.tsx`
- [x] T6 Customer live shipment card — `dashboard/active-shipment-card.tsx` (empty state included; "Quick book" row NOT done, optional)
- [x] T7 Admin ops queue + trend chart — `admin/ops-queue.tsx`, `admin/shipment-trend.tsx` (wired in `admin-overview.tsx`, old Alerts removed)
- [x] T8 Admin tables -> mobile cards — user-manager, payment-list-view, hub-manager, audit-log-view done; rider-approval was already cards (buttons made 44px+); shipment list already had cards
- [x] T9 Admin "Needs attention" popover — `dashboard/attention-popover.tsx`
- [x] T10 Perceived speed — prefetch, staleTime/focus refetch, optimistic rider availability (`hooks/rider.hook.ts`), overview-shaped loading skeletons (`PageSkeleton variant="overview"`)
- [~] T11 Final QA — everything that can be done WITHOUT node_modules/browser is done; the rest needs a machine with network (see "What only a human/real environment can finish")
(When all 11 are ticked, say so; until then never describe the dashboard as "complete".)

### What only a human/real environment can finish (T11 leftovers)
Done in code: skip-link in dashboard shell, `aria-current` on sidebar/tab bar/breadcrumb, labels on every icon-only button (scripted check found none missing),
alt on the only `<img>`, reduced-motion already global, whole-`src` offline syntax check clean, placeholder marketing copy made honest
(`config/landing.ts`: STATS now state only product facts; `SHOW_TESTIMONIALS=false` hides the invented quotes until real ones exist; "Book in minutes").
Still to do on a real machine, in this order:
1. `npm install && npx biome check src --write && npx tsc --noEmit && npx next build` and fix whatever it reports (see the assumptions list below).
2. `npm run dev`, then look at 375 / 768 / 1280px: landing, auth, each role's overview, shipment list/detail, booking wizard, admin tables/cards, profile.
   Specifically check: tab-bar height vs content (`pb-24`), command palette position (`top-[20%]`), dark mode on every page, topbar breadcrumb overflow.
3. Optional product work: customer "Quick book" row (T6), real landing STATS/TESTIMONIALS, demo-parcel panels on the landing use illustrative data.
When 1–2 pass, tick T11 and the dashboard can be called complete.

### Round 5 (account 3) — what was added and where
- `dashboard/theme-toggle.tsx`, `mobile-tab-bar.tsx`, `command-palette.tsx`, `attention-popover.tsx`, `dashboard-topbar.tsx` (rewritten),
  `dashboard-sidebar.tsx` (uses `ROLE_ROUTES`, prefetch, `aria-current`).
- `routes/role-routes.ts` exports `ROLE_ROUTES` and `ROLE_PREFIX`; `routes/{admin,customer,rider}.routes.ts` export `*MobileTabs`;
  `types/sidebar.type.ts` has the `MobileTab` type.
- Rider: `rider/active-delivery-card.tsx` (call / navigate / update status; falls back to the ASSIGNED pickup when nothing is picked up yet),
  `rider/earnings-chart.tsx` (last 7 days, derived from `recentDeliveries` only, so it is partial by design).
- Customer: `dashboard/active-shipment-card.tsx`.
- Hooks: stats + shipment list staleTime / focus refetch (T10).
- Dark-mode sweep: no `bg-white` / `text-slate-*` in dashboard code; remaining `white/10` classes are intentional overlays on `bg-ink`.
  Chart hexes in `overview-charts.tsx` are intentional status colours.
- The old short changelog that used to be called REDESIGN-NOTES.md is now `REDESIGN-CHANGELOG.md` (historical, can be ignored).

### Round 6 (account 3) — T7 + T8
- `admin/ops-queue.tsx`: three queues; counts come from the list responses' `meta.total`. `?status=PENDING|FAILED` deep links were
  checked in source: `shipment-list-view.tsx` reads `status` from the URL and accepts any key of `SHIPMENT_STATUS`.
- `admin/shipment-trend.tsx`: no time-series endpoint exists in `api/analytics.api.ts`, so it counts the latest 100 shipments per day and shows a
  caveat when the window may be truncated. If the backend adds a daily-counts endpoint, replace the derivation.
- T8 pattern: `<ul className="space-y-3 md:hidden">` cards + table wrapped in `hidden ... md:block`. Mobile card actions are 44px (`h-11`).
- Extra assumptions to check on first build: `Rider.createdAt`/`meta.total` exist on the list responses (types say yes);
  recharts `Area` gradient id `trendFill` must stay unique on the page.

### Assumptions that could break the build (check first when you run `tsc` / `next build`)
1. `command-palette.tsx` passes `initialFocus={inputRef}` to `DialogContent` (Base UI Popup prop). If TS rejects it, remove the prop.
2. `command-palette.tsx` has `<div role="option" onClick>` without a key handler (keyboard is handled on the input via aria-activedescendant);
   Biome may raise `useKeyWithClickEvents` — add a `// biome-ignore` with that reason or restructure.
3. `active-delivery-card.tsx` wraps `StatusActions` in a div and enlarges its buttons with `[&_button]:h-12`; check it looks right.
4. `Shipment.rider` is optional (`Rider` has `name`, `contactNumber`); the list endpoint may not include it. If the customer card never
   shows a rider, check the API response before changing the UI.
5. Rider list is fetched with `sortBy:"updatedAt"`; confirm the backend accepts that key (otherwise use `createdAt`).
6. `lucide-react` v1: `Navigation`, `Phone`, `Bell`, `Moon`, `Sun`, `CornerDownLeft`, `Menu`, `Truck` assumed exported; fix imports if not.
7. Admin shipments `?status=FAILED|PENDING` deep links are assumed to work (see T7).

## 8. Verification (what is and isn't proven)
- Never run in a real browser by any previous account (rounds 1–5); animation timing and breakpoints are **unchecked**.
- The zip ships without `node_modules`. Round 1–3 reportedly passed `tsc`, `biome`, `next build`; Rounds 4–5 were only
  syntax-checked (no deps). Before shipping run:
  `npm install && npx biome check src --write && npx tsc --noEmit && npx next build && npm run dev`
  then eyeball 375px, 768px, 1280px. `npm run test:ui` needs the backend API running; `npm run test:api` hits the API.
- Offline syntax-check trick used when deps are missing:
  `tsc --noEmit --jsx preserve --skipLibCheck --target es2022 --moduleResolution bundler --module esnext
  --isolatedModules <changed files>` and grep for `error TS1xxx` (syntax errors only).

## 9. Repo map (where things live)
`src/app/(public)/(marketing)` landing + marketing pages · `src/app/(public)/(authentication)` auth pages ·
`src/app/(dashboard)/{dashboard,rider,admin}` role areas (each has `layout.tsx` with RoleGuard + DashboardShell,
`loading.tsx`) · `src/components/modules/<feature>` feature UI · `src/components/shared` cross-feature pieces ·
`src/components/ui` primitives · `src/components/dashboard` shell/sidebar/topbar/user-menu · `src/routes/*.routes.ts`
sidebar definitions · `src/hooks/*` query hooks · `src/api/*` endpoints · `src/constants/*` labels/status meta ·
`src/config/{site,landing,pricing,demo-accounts}.ts` · `src/utils/*` formatters (`formatCurrency`, `formatDate`,
`mapsSearchUrl`, `normalizePhone`) · `e2e/` API + UI tests.
Files with **no UI** (leave alone): `src/api`, `hooks` (except T10), `validation`, `utils`, `lib`, `proxy.ts`, `types`.
