import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => ({
  locale: locale ?? 'en', // fallback to 'en' if locale is undefined
  messages: (await import(`./messages/${locale ?? 'en'}.json`)).default,
}));
