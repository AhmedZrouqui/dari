import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { jwtVerify } from 'jose';
import { config as appConfig } from './lib/config';

const intlConfig = {
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  localePrefix: 'always' as const,
};

// IMPORTANT: Define the public-facing protected routes
const protectedRoutes = ['/dashboard', '/projects', '/settings'];
const authRoutes = ['/auth/login', 'auth/register'];

async function isTokenValid(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get('auth-token')?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
    return true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host')!;
  const url = request.nextUrl.clone();
  const { pathname } = request.nextUrl;

  // Step 1: Determine the correct internal portal path based on the subdomain
  let portalPath: string;
  if (hostname === appConfig.domains.developer) {
    portalPath = '/(portals)/(developer)';
  } else if (hostname === appConfig.domains.investor) {
    portalPath = '/(portals)/(investor)';
  } else {
    portalPath = '/(portals)/(marketing)';
  }

  // Rewrite to the correct portal route group
  url.pathname = `${portalPath}${pathname}`;
  let response = NextResponse.rewrite(url);

  // Step 2: Handle authentication
  const isValidToken = await isTokenValid(request);
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  const locale =
    intlConfig.locales.find((l) => pathname.startsWith(`/${l}`)) ||
    intlConfig.defaultLocale;

  if (isProtectedRoute && !isValidToken) {
    response = NextResponse.redirect(
      new URL(`/${locale}/auth/login`, request.url)
    );
  }

  if (isAuthRoute && isValidToken) {
    response = NextResponse.redirect(
      new URL(`/${locale}/dashboard`, request.url)
    );
  }

  // Step 3: Apply internationalization
  return createIntlMiddleware(intlConfig)(response as unknown as NextRequest);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
