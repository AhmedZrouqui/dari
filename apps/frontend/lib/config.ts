// lib/config.ts

export const config = {
  domains: {
    developer:
      process.env.NODE_ENV === 'production'
        ? 'developer.dari.com'
        : 'developer.localhost:3000',
    investor:
      process.env.NODE_ENV === 'production'
        ? 'investor.dari.com'
        : 'investor.localhost:3000',
  },
};
