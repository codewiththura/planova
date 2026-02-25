import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session');

  // Define routes that should be accessible without logging in
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup');

  if (!session) {
    // Redirect to login if accessing protected route without an active session
    if (!isAuthRoute) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  } else {
    // If logged in and trying to access login/signup pages, redirect to the dashboard home
    if (isAuthRoute) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|workbox-|icons/).*)'],
};
