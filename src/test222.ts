import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const protectedRoutes = ['/'];
const publicRoutes = ['/register', '/login'];

function hasSessionToken(req: NextRequest) {
  return (
    req.cookies.has('authjs.session-token') ||
    req.cookies.has('__Secure-authjs.session-token') ||
    req.cookies.has('next-auth.session-token') ||
    req.cookies.has('__Secure-next-auth.session-token')
  );
}

export function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const isAuthenticated = hasSessionToken(req);

  const isProtectedRoute = protectedRoutes.some((el) =>
    el === '/' ? pathname === el : pathname.startsWith(el)
  );

  if (isProtectedRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const isPublicRoute = publicRoutes.some((el) =>
    el === '/' ? pathname === el : pathname.startsWith(el)
  );

  if (isPublicRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
