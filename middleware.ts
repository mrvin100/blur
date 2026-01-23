import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/', '/sign-in', '/sign-up'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get session from our auth cookie
  const token = request.cookies.get('auth_token')?.value;
  const hasSession = !!token;

  // If the path is public and user is authenticated, redirect to dashboard
  if (publicPaths.includes(pathname) && hasSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If the path is protected and user is not authenticated, redirect to sign-in
  if (!publicPaths.includes(pathname) && !hasSession) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 