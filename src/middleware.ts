import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// These routes are accessible regardless of login state — NEVER redirect them
const alwaysPublicRoutes = ['/preview', '/public-preview'];

// These routes are only for guests (logged-in users get sent to /dashboard)
const guestOnlyRoutes = ['/login', '/forgot-password', '/reset-password'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Preview routes are always accessible — skip all auth checks
  if (alwaysPublicRoutes.some((route) => pathname.startsWith(route))) {
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

  // Not logged in, redirect to login
  const isPublicRoute = guestOnlyRoutes.some((route) => pathname.startsWith(route));
  if (!isPublicRoute && !isVendorLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public|api).*)'],
};
