import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';
import { Permission } from '@/types/auth';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });

  // Public paths that don't require authentication
  const publicPaths = ['/sign-in'];
  const isPublicPath = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // If the path is public and user is authenticated, redirect to appropriate dashboard
  if (isPublicPath && token) {
    const isAdmin = token.user?.permissions?.some((p: Permission) => p.name === 'ADMIN');
    return NextResponse.redirect(
      new URL(isAdmin ? '/admin/dashboard' : '/dashboard', request.url)
    );
  }

  // If the path is public and user is not authenticated, allow access
  if (isPublicPath) {
    return NextResponse.next();
  }

  // If user is not authenticated and tries to access protected route, redirect to sign-in
  if (!token) {
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(signInUrl);
  }

  // Handle admin routes
  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');
  const isAdmin = token.user?.permissions?.some((p: Permission) => p.name === 'canCreateUsers');

  // If non-admin user tries to access admin route, redirect to user dashboard
  if (isAdminPath && !isAdmin) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If admin user tries to access user dashboard, redirect to admin dashboard
  if (!isAdminPath && isAdmin && request.nextUrl.pathname === '/dashboard') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 