import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const protectedPaths = ['/admin/dashboard', '/profile', '/settings', ];

  // Check if the current path needs protection and if the user is unauthenticated
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path));
  const token = request.cookies.get('auth');

  if (isProtectedPath && !token) {
    // Redirect to the login page if not authenticated
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
};

// Optionally, you can define a matcher to control which paths the proxy runs on
// export const config = {
//   matcher: [
    // '/dashboard/:path*', 
    // '/profile/:path*', 
    // '/settings/:path*'
// ],
// };