import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const baseExperimental = {
  optimizePackageImports: ['@mantine/core', '@mantine/hooks'],
};

const nextConfig: NextConfig = {
  // Core performance optimizations
  experimental: {
    ...baseExperimental,
    ...(process.env.ANALYZE === 'true' &&
      {
        // Add bundle analyzer experimental features here if needed
      }),
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Strict mode for better development experience
  reactStrictMode: true,

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
    dirs: ['app', 'components', 'lib', 'hooks'],
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
