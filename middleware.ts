import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthPage = request.nextUrl.pathname.startsWith('/sign-in');

  // Handle NextAuth authentication
  if (isAuthPage) {
    if (token) {
      // Redirect to appropriate dashboard based on role
      const role = token.role as 'ADMIN' | 'USER';
      return NextResponse.redirect(new URL(`/dashboard/@${role.toLowerCase()}`, request.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(signInUrl);
  }

  // If trying to access admin dashboard, verify admin role
  if (request.nextUrl.pathname.startsWith('/dashboard/@admin') && token.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard/@user', request.url));
  }

  // If trying to access user dashboard, verify user role
  if (request.nextUrl.pathname.startsWith('/dashboard/@user') && token.role !== 'USER') {
    return NextResponse.redirect(new URL('/dashboard/@admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/sign-in',
    '/dashboard/:path*'
  ]
}; 