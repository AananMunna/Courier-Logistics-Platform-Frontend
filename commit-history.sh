#!/usr/bin/env bash
# Splits the project into logical commits, bottom-up (each layer only depends on earlier ones).
# Real timestamps are used; nothing is backdated. Run from the project root.
set -euo pipefail

[ -d .git ] || git init -b main
git config user.name  >/dev/null || { echo "Set git user.name first";  exit 1; }
git config user.email >/dev/null || { echo "Set git user.email first"; exit 1; }

c() { # c "message" path...   -> stage existing paths, commit if anything is staged
  local msg="$1"; shift
  for p in "$@"; do if [ -e "$p" ]; then git add -- "$p" 2>/dev/null || true; fi; done
  if ! git diff --cached --quiet; then git commit -q -m "$msg" && echo "ok: $msg"; fi
}

c "chore: initialize Next.js project with TypeScript and Tailwind" \
  package.json package-lock.json tsconfig.json next-env.d.ts postcss.config.mjs next.config.ts .gitignore
c "chore: add Biome lint and format configuration" biome.json
c "chore: add shadcn config and environment template" components.json .env.example
c "feat: add global styles and design tokens" src/app/globals.css
c "feat: add shared types, constants and validation schemas" src/types src/constants src/validation
c "feat: add utility helpers and site configuration" src/utils src/lib src/config
c "feat: add API client and API modules" src/api
c "feat: add data hooks with TanStack Query" src/hooks src/providers
c "feat: add base UI component library" src/components/ui
c "feat: add form field components" src/components/form
c "feat: add shared components, motion helpers and brand assets" src/components/shared src/components/motion src/assets public
c "feat: add public site header and footer layout" src/components/layout
c "feat: add authentication components and modules" src/components/auth src/components/modules/auth src/components/modules/google-login
c "feat: add landing page sections" src/components/modules/homepage
c "feat: add pricing, hubs, contact and tracking modules" \
  src/components/modules/pricing src/components/modules/hubs src/components/modules/contact src/components/modules/tracking
c "feat: add dashboard shell, sidebar, topbar and role routes" src/components/dashboard src/routes
c "feat: add shipment booking, listing and detail modules" src/components/modules/shipments src/components/modules/payments
c "feat: add customer and rider dashboard modules" \
  src/components/modules/dashboard src/components/modules/rider src/components/modules/profile
c "feat: add admin management modules" src/components/modules/admin
c "feat: add route protection proxy" src/proxy.ts
c "feat: add app routes, layouts and error pages" src/app
c "test: add API and UI end-to-end tests" e2e
c "docs: add project README and notes" README.md REDESIGN-NOTES.md REDESIGN-CHANGELOG.md AGENTS.md CLAUDE.md

# Safety net: anything not covered above goes into one final commit instead of being lost.
git add -A
git diff --cached --quiet || git commit -q -m "chore: add remaining project files"

echo; git log --oneline | cat
echo; git status --short | head