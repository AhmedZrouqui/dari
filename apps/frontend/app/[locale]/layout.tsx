import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import React from 'react';
import { ColorSchemeScript } from '@mantine/core';
import { Outfit } from 'next/font/google';
import { AppProviders } from '../../components/providers/AppProviders';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import clsx from 'clsx';

const outfit = Outfit({ subsets: ['latin'] });

export const metadata = {
  title: 'Dari - Real Estate Management',
  description: 'The future of real estate project management and investment.',
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const messages = await getMessages({ locale: locale ?? 'en' });

  return (
    <html lang={locale ?? 'en'} data-mantine-color-scheme="light">
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body className={clsx(outfit.className, 'bg-red-100')}>
        <NextIntlClientProvider messages={messages}>
          <AppProviders>{children}</AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
