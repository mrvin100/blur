import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const publicPaths = ['/', '/sign-in', '/sign-up'];

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // If the path is public and user is authenticated, redirect to dashboard
  if (publicPaths.includes(pathname) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If the path is protected and user is not authenticated, redirect to sign-in
  if (!publicPaths.includes(pathname) && !token) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Handle dashboard routes
  if (pathname.startsWith('/dashboard')) {
    const isAdmin = token?.user?.permissions?.some((p: any) => p.name === 'canCreateUsers');
    
    // If user tries to access admin-specific routes without admin permissions
    if (pathname.startsWith('/dashboard/admin') && !isAdmin) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    
    // If admin tries to access user-specific routes
    if (pathname.startsWith('/dashboard/user') && isAdmin) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}; 