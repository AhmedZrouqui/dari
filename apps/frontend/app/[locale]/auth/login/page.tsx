// ===================================
// File: app/[locale]/auth/login/page.tsx (FINAL REDESIGN)
// Description: A professional, two-column login page layout.
// ===================================

'use client';

import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Stack,
  Anchor,
  Group,
  Checkbox,
} from '@mantine/core';
import { AtSign, Lock } from 'lucide-react';
import Link from 'next/link';
import { useLoginForm } from '@/hooks/auth/useLoginForm';
import { LoginFormValues } from '@/lib/schemas/login.schema';

export default function LoginPage() {
  const { register, handleSubmit, errors, isSubmitting, handleLogin, t } =
    useLoginForm();

  const onSubmit = async (data: LoginFormValues) => await handleLogin(data);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      {/* Left Column - Branding */}
      <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-dari-blue-800 to-slate-900 text-white">
        <div>
          <Link
            href="/"
            className="flex items-center gap-3 no-underline text-white"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 22L12 14L20 22"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 14L12 6L20 14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 6L12 2L20 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <Title order={2}>Dari</Title>
          </Link>
        </div>
        <div>
          <Title order={1} className="font-light">
            The Single Source of Truth
          </Title>
          <Text size="xl" c="blue.1" mt="md">
            For your entire project portfolio. Manage progress, track
            milestones, and build stakeholder trust, all in one place.
          </Text>
        </div>
        <Text size="sm" c="blue.2">
          © {new Date().getFullYear()} Dari Inc. All rights reserved.
        </Text>
      </div>

      {/* Right Column - Form */}
      <div className="bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 md:hidden">
            <Title order={2} className="font-medium text-slate-800">
              {t('title')}
            </Title>
          </div>

          <Paper withBorder shadow="md" p="xl" radius="lg">
            <Title
              order={3}
              className="font-medium text-slate-800 hidden md:block"
            >
              {t('title')}
            </Title>
            <Text c="dimmed" size="sm" mt="xs" mb="xl">
              {t('subtitle')}
            </Text>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack gap="lg">
                <TextInput
                  disabled={isSubmitting}
                  label="Email Address"
                  placeholder="you@dari-app.com"
                  required
                  size="md"
                  leftSection={<AtSign size={16} className="text-gray-400" />}
                  {...register('email')}
                  error={errors.email?.message}
                />

                <PasswordInput
                  disabled={isSubmitting}
                  label="Password"
                  placeholder="Your password"
                  required
                  size="md"
                  leftSection={<Lock size={16} className="text-gray-400" />}
                  {...register('password')}
                  error={errors.password?.message}
                />

                <Group justify="space-between" mt="xs">
                  <Checkbox label="Remember me" disabled={isSubmitting} />
                  <Anchor
                    component={Link}
                    href="/auth/forgot-password"
                    size="sm"
                  >
                    {t('forgotPassword')}
                  </Anchor>
                </Group>

                <Button
                  type="submit"
                  fullWidth
                  mt="md"
                  size="md"
                  loading={isSubmitting}
                >
                  {t('submitButton')}
                </Button>
              </Stack>
            </form>

            <Text c="dimmed" size="sm" ta="center" mt="xl">
              {t('registerPrompt')}{' '}
              <Anchor component={Link} href="/auth/register" size="sm" fw={500}>
                {t('registerLink')}
              </Anchor>
            </Text>
          </Paper>
        </div>
      </div>
    </div>
  );
}
