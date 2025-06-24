// middleware.ts
import createIntlMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Create the intl middleware
const intlMiddleware = createIntlMiddleware({
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  localeDetection: true,
  localePrefix: 'always',
});

// Define protected and auth routes (without locale prefix)
const protectedRoutes = ['/dashboard', '/profile', '/settings'];
const authRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password'];

async function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Extract locale and path
  const pathnameIsMissingLocale = ['en', 'fr'].every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // If locale is missing, let intl middleware handle it first
  if (pathnameIsMissingLocale) {
    return intlMiddleware(request);
  }

  // Extract the locale and path without locale
  const locale = pathname.split('/')[1];
  const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';

  // Check if current path is protected or auth route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) =>
    pathWithoutLocale.startsWith(route)
  );

  // Get token from cookies (more secure than localStorage for SSR)
  const token = request.cookies.get('auth-token')?.value;

  let isValidToken = false;
  if (token) {
    try {
      // Verify JWT token
      await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
      isValidToken = true;
    } catch (error) {
      // Token is invalid, clear it
      console.log('Invalid token:', error);
    }
  }

  // Handle redirects for protected routes
  if (isProtectedRoute && !isValidToken) {
    const loginUrl = new URL(`/${locale}/auth/login`, request.url);
    const response = NextResponse.redirect(loginUrl);

    // Clear invalid token cookie
    if (token) {
      response.cookies.delete('auth-token');
    }

    return response;
  }

  // Handle redirects for auth routes (if already authenticated)
  if (isAuthRoute && isValidToken) {
    const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // If no auth logic applies, use intl middleware for locale handling
  return intlMiddleware(request);
}

export default authMiddleware;

export const config = {
  matcher: [
    // Match all pathnames except for
    // - API routes
    // - files with extensions (e.g. favicon.ico)
    // - Next.js internal files
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
