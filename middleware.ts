import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session');

  // Define routes that should be accessible without logging in
  const isAuthRoute =
    request.nextUrl.pathname.startsWith('/login') ||
    request.nextUrl.pathname.startsWith('/signup') ||
    request.nextUrl.pathname.startsWith('/onboarding');

  // Session cookie presence check.
  // Note: Firebase ID tokens expire in ~1 hour but Firebase SDK auto-refreshes
  // them and the onIdTokenChanged listener in firebase.ts will update the cookie.
  // We only use cookie presence here; Firebase on the client enforces real auth.
  if (!session || !session.value) {
    // Redirect to login if accessing a protected route without a session cookie
    if (!isAuthRoute) {
      const loginUrl = new URL('/login', request.url);
      // Pass the original path so we can redirect back after login (optional)
      loginUrl.searchParams.set('from', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  } else {
    // If logged in and trying to access login/signup pages, redirect to the dashboard home
    if (isAuthRoute && request.nextUrl.pathname !== '/onboarding') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|workbox-|icons/|screenshots/|illustrations/).*)',
  ],
};
