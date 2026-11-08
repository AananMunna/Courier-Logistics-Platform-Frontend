# ForegX-7 — React Performance & Optimization Report

**Project:** CourierGo — Courier & Logistics Platform (Next.js 16 App Router, React 19, React Compiler on)
**Live URL:** https://couriergo.vercel.app/ (deploy this branch's preview, then fill in the "after" numbers below)
**Branch:** `perf/react-optimization`

> Measurements marked **✅ measured** were produced by `scripts/bundle-size.mjs` / `scripts/route-js.mjs`
> against real `next build` output (before = `main`, after = this branch).
> Rows marked **⏳ to capture** need a browser against the deployed site (Lighthouse, React Profiler, Web Vitals) —
> steps are in [How to capture](#how-to-capture-the-browser-measurements). Nothing below is estimated or invented.

## 1. Initial bottlenecks (found by reading the code + build output)

| # | Bottleneck | Evidence |
|---|-----------|----------|
| 1 | **Recharts (~365 kB raw / ~104 kB gzip) loaded eagerly on `/admin`** even though the charts render only after stats arrive | `/admin` initial JS = 941.8 kB; chunk contains `CartesianGrid`/`ResponsiveContainer` |
| 2 | **Whole admin & customer overview were one `"use client"` tree**, including purely static hero markup | `admin-overview.tsx`, `customer-overview.tsx` |
| 3 | **No way to render large datasets** — lists are server-paginated (10/page); anything with 1,000+ rows would put every row in the DOM | `shipment-list.tsx`, `user-manager.tsx` |
| 4 | Frequently-changing UI state (row selection, scroll position) would live in React state and re-render every row | design risk addressed in the new Data Explorer |

## 2. Optimizations implemented

### Rendering & components
- `React.memo` on `ShipmentRow`, `ActivityRow`, `ShipmentHeader`; `useCallback` for `renderRow`, `getKey`, `onToggle`, `onVisibleStart`; `useMemo` for filtered rows and generated datasets (`large-data-explorer.tsx`).
- Stable references: module-level `renderActivity` / `getActivityKey` so memoized rows never get new function props.
- State colocation: each panel (shipments / activity) owns its own search term; typing in one never renders the other.
- Components split into small units (`VirtualList`, rows, header, panels, `CustomerHero`, `CustomerGreeting`).
- Note: the project also runs **React Compiler**; manual memoization is kept explicit where the assignment requires it and where reference stability crosses a `memo` boundary.

### DOM virtualization (2 lists, 1,000+ records)
- `src/components/shared/virtual-list.tsx` (TanStack Virtual, fixed row height, `overscan` 8/6, absolute-positioned rows, resets to top on filter change).
- **Shipments:** 1,200 rows. **Activity feed:** 1,500 rows. Only ~15–25 `<li>` exist in the DOM at any time.
- Data is deterministic representative data (`src/lib/mock-data.ts`, seeded PRNG) so runs are reproducible. Route: `/admin/data-explorer`.

### State decoupling & events
- **Debounced search ×2:** both panels use the existing `SearchInput` (400 ms `useDebounce`) — typing doesn't filter 1,500 rows per keystroke.
- **External store:** `src/lib/selection-store.ts` + `useSyncExternalStore`. Each row subscribes to `isSelected(id)` only → clicking a row re-renders **1 row + the toolbar**, not the table.
- **`useRef` + `requestAnimationFrame`:** the "Row N of M" indicator is updated by a rAF-throttled scroll listener writing straight to a ref'd DOM node — scrolling causes **0 React renders**.

### Bundle size & code splitting
- `React.lazy` + `Suspense` for `ShipmentTrend` and `OverviewCharts` (Recharts) in `admin-overview.tsx`, with fixed-height skeleton fallbacks (no layout shift).
- `next/dynamic` for the Data Explorer so its virtualization code is its own chunk.

### Dependency & import audit
- **Recharts** (~365 kB raw) — lazy-loaded (above). **Google OAuth** (`@react-oauth/google`) — was a global provider wrapping the whole app (loads Google's GSI script on every route); now scoped inside the Google button, so it only loads on login/register.
- **Removed unused dependency:** `react-day-picker` was only imported by `src/components/ui/calendar.tsx`, which nothing used. Both removed.
- Audited the rest: every other dependency is imported in `src/` (`shadcn` is used via `@import "shadcn/tailwind.css"`), so nothing else is removable.
- Tree shaking: all `lucide-react` (88 imports) and `date-fns` imports are named imports — already tree-shakeable; no barrel/namespace imports to fix.

### Server / Client boundary
1. **`/admin`**: the hero (`DashboardHero` + `LinkButton`s) moved out of the client component into the Server Component `page.tsx`. Only live stats remain client.
2. **`/dashboard`**: the large static hero moved to Server Component `CustomerHero`; the only client pieces are `TrackForm` (needs router/state) and a 6-line `CustomerGreeting` (needs the signed-in user). The static markup no longer ships as JS.
3. **`/admin/data-explorer`**: page shell/metadata/header are server-rendered; only the interactive lists hydrate.

## 3. Results

### Bundle (✅ measured, `next build`, gzip via `zlib`)

| Route initial client JS | Before (`main`) | After | Change |
|---|---|---|---|
| `/admin` raw | 941.8 kB | **521.5 kB** | **−420.3 kB (−45%)** |
| `/admin` gzip | 296.4 kB | **174.6 kB** | **−121.8 kB (−41%)** |
| Recharts in initial `/admin` load | yes | **no (lazy chunk)** | removed |
| `/dashboard` raw | 531.0 kB | 526.4 kB | −4.6 kB (server hero + Google provider scoped) |

All-chunks total grows from 2,711 kB → 2,868 kB raw because the new Data Explorer route and lazy chunks exist — that is code that is **not** loaded on the other routes. Raw data: `perf/*.json`.

### Lighthouse / Profiler / Web Vitals
| Metric | Before | After |
|---|---|---|
| Lighthouse Performance (`/admin`, mobile) | ⏳ to capture on `main` deploy | ⏳ to capture on this branch |
| LCP (target ≤ 2.5 s) | ⏳ | ⏳ |
| INP (target ≤ 200 ms) | ⏳ | ⏳ |
| CLS (target ≤ 0.1) | ⏳ | ⏳ |
| Profiler: commits while typing in a 1,200-row list | n/a (list did not exist) | ⏳ expect rows not re-rendering |
| Profiler: commits when selecting a row | n/a | ⏳ expect 1 row + toolbar |

### How to capture the browser measurements
1. Deploy `main` and this branch (Vercel preview). Log in with a demo admin account.
2. Chrome → Incognito → DevTools → Lighthouse → *Mobile*, *Performance* only, same throttling both times, on `/admin` and `/admin/data-explorer`. Save the JSON/HTML.
3. React DevTools → Profiler → record: (a) type in the search box, (b) click rows, (c) scroll. Screenshot the flamegraph/"Why did this render".
4. Record real Web Vitals with the Web Vitals extension; report honestly even if a target is missed.

## 4. Remaining limitations
- Existing server-paginated tables (users, shipments, audit logs) are intentionally unchanged: they render 10–15 rows, so virtualizing them would add complexity with no gain. The 1,000+ row virtualization is demonstrated on the Data Explorer with representative data; wiring it to a real bulk endpoint needs a backend `limit` > 100.
- The Data Explorer uses generated data, not live API data.
- ~455 kB shared framework chunk and a 223 kB chunk remain on every route (React/Next runtime, Base UI, TanStack Query); further wins would need dependency-level audits (`lucide-react` import audit, `date-fns` usage).
- Lighthouse, Profiler recordings and Core Web Vitals are not yet captured (see table above).
- The `test:ui` / `test:api` npm scripts point at an `e2e/` folder that does not exist in the repo (pre-existing), so no automated tests could be run. Verified with `next build`, `tsc --noEmit` and Biome only; manual mobile/tablet/dark-mode/console checks still to do in the browser.
