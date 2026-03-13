import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/login'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

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

  // Already logged in, redirect away from login
  if (isPublicRoute && isVendorLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Not logged in, redirect to login
  if (!isPublicRoute && !isVendorLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public|api).*)'],
};
