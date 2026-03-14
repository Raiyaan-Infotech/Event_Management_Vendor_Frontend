# Vendor Portal — CLAUDE.md

## Project Overview
Standalone Next.js 15.1 vendor-facing portal. Completely separate from the AdminPanel frontend. Vendors log in with their own credentials and manage their profile, clients, events, payments, reports, activity log, and settings. Built with React 19, Shadcn/ui, TanStack Query, and Tailwind CSS.

## Tech Stack
- **Framework:** Next.js 15.1 (App Router) + React 19 + TypeScript 5
- **UI:** Shadcn/ui + Radix UI + Tailwind CSS 4 + Lucide icons + FontAwesome
- **State/Data:** TanStack React Query v5
- **HTTP:** Axios via `/api/proxy/v1/*` (Next.js proxy route)
- **Forms:** React Hook Form + Zod validation
- **Auth:** JWT via HttpOnly cookies (`vendor_access_token`, `vendor_refresh_token`)
- **Notifications:** Sonner (toast)
- **Charts:** Recharts

## Project Structure
```
src/
├── app/
│   ├── (auth)/
│   │   └── login/              # Vendor login page
│   ├── (dashboard)/
│   │   ├── layout.tsx          # Dashboard shell (Sidebar + Header + Breadcrumb + children)
│   │   ├── dashboard/          # Main dashboard page
│   │   ├── profile/            # Vendor profile settings page
│   │   └── activity-log/       # Vendor activity log page (real API integrated)
│   ├── api/
│   │   ├── proxy/v1/[...path]/ # Proxy → backend (forwards cookies)
│   │   ├── vendors/auth/login/ # Dedicated login route (sets HttpOnly cookies reliably)
│   │   └── logout/             # Clears HttpOnly cookies server-side
│   ├── layout.tsx              # Root layout (ThemeProvider + QueryProvider + Toaster)
│   └── page.tsx                # Root → redirects to /login
├── components/
│   ├── ui/                     # Shadcn primitives
│   ├── layout/
│   │   ├── Header/VendorHeader.tsx      # Top bar: sidebar trigger, search, lang, fullscreen, clock, theme, notifications, profile
│   │   ├── Sidebar/VendorSidebar.tsx    # Collapsible sidebar with nested nav groups
│   │   └── Breadcrumb/VendorBreadcrumb.tsx  # 30px auto breadcrumb bar below header
│   └── theme-provider.tsx
├── hooks/
│   ├── use-vendors.ts          # useVendorMe, useVendorLogout, useUpdateVendorProfile, useChangeVendorPassword, useVendorActivityLog
│   └── use-media.ts            # useUploadMedia
├── lib/
│   ├── api-client.ts           # Axios instance (baseURL: /api/proxy/v1)
│   ├── query-client.ts         # TanStack Query config
│   └── utils.ts                # cn(), resolveMediaUrl()
├── providers/
│   └── query-provider.tsx
└── middleware.ts               # Route protection: /dashboard/* requires vendor session
```

## Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

## Dev Commands
```bash
npm run dev      # Start dev server (port 3001 to avoid clash with adminpanel on 3000)
npm run build    # Production build
npm run lint     # ESLint check
```

## Auth Flow
1. Vendor visits `/login` → POST to `/api/vendors/auth/login` (dedicated route, NOT proxy)
2. Backend sets `vendor_access_token` + `vendor_refresh_token` HttpOnly cookies
3. Frontend sets short-lived `vendor_auth_pending=true` JS cookie (15s) for middleware bridging
4. Redirect to `/dashboard`
5. Middleware checks cookies → unauthenticated → `/login`
6. Logout: POST `/api/proxy/v1/vendors/auth/logout` + server-side cookie clear via `/api/logout`

### Why a dedicated login route?
`new Headers(request.headers)` in Next.js Route Handlers may not include Cookie header reliably.
The dedicated `/api/vendors/auth/login/route.ts` uses `cookies()` from `next/headers` to set
HttpOnly cookies server-side after calling the backend directly (not through the proxy).

## Vendor Auth Cookies
- `vendor_access_token` — HttpOnly, 15min TTL
- `vendor_refresh_token` — HttpOnly, 7 day TTL
- `vendor_auth_pending` — JS-writable, 15s TTL (middleware bridge only)

**IMPORTANT:** Vendor auth is completely separate from admin auth:
- Vendor JWT payload: `{ id, email, type: 'vendor' }` — uses `type` field, NOT `role`
- Admin JWT payload: `{ userId, email, role, companyId, roleLevel }`
- Backend middleware: `vendorAuth.js` checks `decoded.type === 'vendor'`
- Admin panel does NOT handle `/vendor` routes — the vendor portal is standalone

## API Integration Pattern
All API calls (except login) go through the Next.js proxy:
```
Browser → /api/proxy/v1/* → Next.js Route Handler → Backend (localhost:5000/api/v1/*)
```
- Proxy explicitly rebuilds Cookie header via `request.cookies.getAll()`
- `axios` baseURL is `/api/proxy/v1`
- 401 responses auto-redirect to `/login`

## Backend Vendor Routes (Express)
```
POST   /vendors/auth/login           → login (public)
POST   /vendors/auth/logout          → logout (public)
GET    /vendors/auth/me              → get own profile (vendor JWT)
PUT    /vendors/auth/profile         → update own profile (vendor JWT)
POST   /vendors/auth/change-password → change password (vendor JWT)
GET    /vendors/auth/activity        → get own activity logs (vendor JWT)
```
Backend: `D:\Jamal\AdminPanel-Backend`
Middleware: `src/middleware/vendorAuth.js`
Controller: `src/controllers/vendor.controller.js`
Service: `src/services/vendor.service.js`

## Hooks
```typescript
useVendorMe()                    // GET /vendors/auth/me — staleTime 5min, retry: false
useVendorLogout()                // POST /vendors/auth/logout + cookie clear
useUpdateVendorProfile()         // PUT /vendors/auth/profile — invalidates vendor-me cache
useChangeVendorPassword()        // POST /vendors/auth/change-password
useVendorActivityLog(params?)    // GET /vendors/auth/activity — staleTime 30s
                                 //   params: { page?, limit?, module?, search? }
useUploadMedia()                 // POST /media/upload (multipart/form-data)
```

## Activity Log Integration
The activity log page (`/activity-log`) is fully integrated with the backend.

### Backend changes made (D:\Jamal\AdminPanel-Backend):
- `src/models/ActivityLog.js` — added `vendor_id` INTEGER NULL column
- `src/models/index.js` — added `Vendor ↔ ActivityLog` association
- `src/middleware/activityLogger.js` — added `logVendorActivity(vendorId, action, module, description, req)`
- `src/services/activityLog.service.js` — added `getByVendor(vendorId, query)` with module/search filters
- `src/controllers/vendor.controller.js` — logs activity on login/logout/updateProfile/changePassword; added `getMyActivity`
- `src/routes/vendor.routes.js` — added `GET /vendors/auth/activity` (vendor JWT protected)

### Database migration required:
```sql
ALTER TABLE activity_logs ADD COLUMN vendor_id INT NULL;
```

### Logged actions and their modules:
| action           | module           | triggered by         |
|-----------------|------------------|----------------------|
| `login`          | `vendor_auth`    | successful login     |
| `logout`         | `vendor_auth`    | logout               |
| `update_profile` | `vendor_profile` | profile update       |
| `change_password`| `vendor_security`| password change      |

### Frontend category → module mapping:
| UI Category    | module filter     |
|---------------|-------------------|
| Authentication | `vendor_auth`     |
| Security       | `vendor_security` |
| Profile        | `vendor_profile`  |
| System         | `vendor_system`   |

## Layout Structure
```
SidebarProvider
└── VendorSidebar (collapsible icon sidebar)
└── SidebarInset
    ├── VendorHeader (h-[56px] sticky)
    ├── VendorBreadcrumb (h-[30px] auto, hidden on /dashboard)
    └── div.flex-1 (scrollable content)
        └── div.px-4..pt-6.pb-6
            └── {children}
```

## Sidebar Nav Structure
The sidebar uses collapsible groups (Shadcn `Collapsible` + `CollapsibleContent`).
Parent items with children: clicking navigates to their `href` AND toggles children open/closed.
Children use the same button styling as top-level items, indented with `pl-8`.

```
Dashboard          → /dashboard  (collapsible)
  └── Analytics    → /analytics
Clients            → /clients
Payments           → /payments
Reports            → /reports
Activity Log       → /activity-log
Profile            → /profile    (collapsible)
  ├── Change Password → /profile?tab=security
  └── Logout          → calls useVendorLogout()
Transactions       → /transactions
Settings           → (no href, collapsible only)
  ├── Payment Settings → /settings/payments
  ├── Configuration    → /settings/config
  ├── Currency         → /settings/currency
  └── Timezone         → /settings/timezone
Help               → /help
Website Management → /website
```

**Important sidebar rules:**
- Do NOT nest `SidebarMenuItem` (`<li>`) inside another `SidebarMenuItem` — causes hydration error
- `CollapsibleContent` must be a sibling of `SidebarMenuItem`, not a child of it
- Children rendered inside `CollapsibleContent` use `SidebarMenuItem` directly (not wrapped in the parent's `<li>`)

## Profile Page Design
Matches reference project `dashboard_clone_07-03-2026_v1` exactly:
- **Left column** (one card): Avatar (clickable upload) + Name + Company | Basic Info (inline edit) | Security Status | Quick Actions
- **Right column**: Sticky tab bar (Activity / Security / Notifications) + tab content card
- Activity tab: hardcoded recent activity log (to be replaced with real API in future)
- Security tab: 2FA toggle (with modal), Change Password (with modal), View Sessions (with modal)
- Notifications tab: toggleable notification preferences (local state, no API yet)

## Breadcrumb
- 30px bar between header and content — copies reference design exactly
- `text-[10px]`, `bg-white dark:bg-card`, `border-b border-border`
- Last segment: `text-primary font-bold`
- FontAwesome `faChevronRight` separator
- Auto-generates from pathname segments — hidden on `/dashboard`

## Key Patterns
- `resolveMediaUrl(url)` — converts relative `/uploads/...` paths to full backend URL
- Profile image upload: `useUploadMedia` → get URL → `useUpdateVendorProfile({ profile: url })`
- Dark mode: `next-themes` class strategy, `dark:` Tailwind prefix
- No company context / RBAC / approval workflow — vendor portal is simpler than adminpanel
