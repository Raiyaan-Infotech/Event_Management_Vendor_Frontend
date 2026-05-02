import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes always accessible — no auth checks
const alwaysPublicRoutes = ['/preview', '/public-preview'];

// Guest-only routes (logged-in users → /dashboard)
const guestOnlyRoutes = ['/login', '/forgot-password', '/reset-password'];

// All known "system" top-level paths — anything NOT in this list and not a
// known system prefix is treated as a public vendor slug (e.g. /royal-events)
const SYSTEM_PREFIXES = [
  '/dashboard', '/analytics', '/clients', '/staff', '/communication',
  '/reports', '/transactions', '/events', '/payment-management',
  '/settings', '/appearance', '/help', '/website', '/roles', '/modules',
  '/activity-log', '/newsletter', '/login', '/forgot-password',
  '/reset-password', '/preview', '/public-preview', '/api',
];

function isPublicVendorSlug(pathname: string): boolean {
  // Must be exactly one segment like /royal-events (not /royal-events/something/deep)
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length < 1 || parts.length > 3) return false;
  // First segment must not be a known system prefix
  const first = `/${parts[0]}`;
  return !SYSTEM_PREFIXES.some((p) => first === p || first.startsWith(p));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always-public routes — skip auth checks
  if (alwaysPublicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Public vendor slug pages — accessible without login
  if (isPublicVendorSlug(pathname)) {
    return NextResponse.next();
  }

  // Vendor session cookies
  const vendorAccessToken  = request.cookies.get('vendor_access_token')?.value;
  const vendorRefreshToken = request.cookies.get('vendor_refresh_token')?.value;
  const vendorAuthPending  = request.cookies.get('vendor_auth_pending')?.value === 'true';
  const isVendorLoggedIn   = !!(vendorAccessToken || vendorRefreshToken || vendorAuthPending);

  // Root → redirect
  if (pathname === '/') {
    return isVendorLoggedIn
      ? NextResponse.redirect(new URL('/dashboard', request.url))
      : NextResponse.redirect(new URL('/login', request.url));
  }

  // Already logged in, redirect away from guest-only pages
  if (guestOnlyRoutes.some((route) => pathname.startsWith(route)) && isVendorLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Not logged in → login page
  const isPublicRoute = guestOnlyRoutes.some((route) => pathname.startsWith(route));
  if (!isPublicRoute && !isVendorLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public|api).*)'],
};

