// import { auth } from '@/libs/auth/auth';
// import { NextResponse } from 'next/server';

// const protectedRoutes = ['/'];
// const publicRoutes = ['/register', '/login'];

// export const proxy = auth((req) => {
//   const pathname = req.nextUrl.pathname;
//   const isAuthenticated = !!req.auth;

//   const isProtectedRoute = protectedRoutes.some((el) =>
//     el === '/' ? pathname === el : pathname.startsWith(el)
//   );

//   if (isProtectedRoute && !isAuthenticated) {
//     return NextResponse.redirect(new URL('/login', req.url));
//   }

//   const isPublicRoute = publicRoutes.some((el) =>
//     el === '/' ? pathname === el : pathname.startsWith(el)
//   );

//   if (isPublicRoute && isAuthenticated) {
//     return NextResponse.redirect(new URL('/', req.url));
//   }

//   return NextResponse.next();
// });

// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
// };
