// ===================================
// File: app/[locale]/auth/register/page.tsx (REDESIGNED)
// Description: A sophisticated, centered, multi-step registration form.
// ===================================

'use client';

import {
  Stepper,
  Button,
  Group,
  TextInput,
  PasswordInput,
  Paper,
  Title,
  Text,
  Stack,
  Anchor,
} from '@mantine/core';
import { AtSign, Lock, User as UserIcon, Building } from 'lucide-react';
import Link from 'next/link';
import { useRegistrationForm } from '@/hooks/auth/useRegistrationForm';
import { RegistrationFormValues } from '@/lib/schemas/registration.schema';

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    nextStep,
    prevStep,
    active,
    setActive,
    t,
    createUser,
  } = useRegistrationForm();

  const onSubmit = async (data: RegistrationFormValues) => {
    await createUser(data);
  };

  return (
    // Main container to center the form vertically and horizontally
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-2xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <svg
            className="mx-auto h-12 w-auto text-dari-blue-600"
            width="48"
            height="48"
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
          <Title order={2} className="mt-4 font-medium text-slate-800">
            {t('title')}
          </Title>
          <Text c="dimmed" size="sm" mt="xs">
            {t('subtitle')}
          </Text>
        </div>

        {/* Form Section */}
        <Paper withBorder shadow="md" p="xl" radius="lg">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stepper
              active={active}
              onStepClick={setActive}
              allowNextStepsSelect={false}
            >
              {/* STEP 1: ACCOUNT */}
              <Stepper.Step
                label={t('step1.label')}
                description={t('step1.description')}
                key={'step-1'}
              >
                <Stack gap="lg" mt="xl">
                  <TextInput
                    label={t('step1.emailLabel')}
                    placeholder="you@dari-app.com"
                    leftSection={<AtSign size={16} />}
                    {...register('email')}
                    error={errors.email?.message}
                  />
                  <PasswordInput
                    label={t('step1.passwordLabel')}
                    placeholder="••••••••"
                    leftSection={<Lock size={16} />}
                    {...register('password')}
                    error={errors.password?.message}
                  />
                </Stack>
              </Stepper.Step>

              {/* STEP 2: PROFILE */}
              <Stepper.Step
                label={t('step2.label')}
                description={t('step2.description')}
                key={'step-2'}
              >
                <Stack gap="lg" mt="xl">
                  <TextInput
                    label={t('step2.nameLabel')}
                    placeholder="e.g., Yassine Bennani"
                    leftSection={<UserIcon size={16} />}
                    {...register('name')}
                    error={errors.name?.message}
                  />
                </Stack>
              </Stepper.Step>

              {/* STEP 3: ORGANIZATION */}
              <Stepper.Step
                label={t('step3.label')}
                description={t('step3.description')}
                key={'step-3'}
              >
                <Stack gap="lg" mt="xl">
                  <TextInput
                    label={t('step3.orgNameLabel')}
                    placeholder="e.g., Bennani Developments"
                    leftSection={<Building size={16} />}
                    {...register('organizationName')}
                    error={errors.organizationName?.message}
                  />
                  <Text size="xs" c="dimmed">
                    {t('step3.orgNameHint')}
                  </Text>
                </Stack>
              </Stepper.Step>

              <Stepper.Completed>
                <Text ta="center" mt="xl">
                  {t('completedText')}
                </Text>
              </Stepper.Completed>
            </Stepper>

            <Group justify="space-between" mt="xl">
              {active > 0 ? (
                <Button variant="default" onClick={prevStep}>
                  {t('backButton')}
                </Button>
              ) : (
                <div />
              )}

              {/* This logic now handles the final step submission correctly */}
              {active === 2 ? (
                <Button onClick={handleSubmit(onSubmit)} loading={isSubmitting}>
                  {t('createAccountButton')}
                </Button>
              ) : (
                <Button onClick={nextStep}>{t('nextButton')}</Button>
              )}
            </Group>

            <Text c="dimmed" size="sm" ta="center" mt="xl">
              {t('loginPrompt')}{' '}
              <Anchor component={Link} href="/auth/login" size="sm" fw={500}>
                {t('loginLink')}
              </Anchor>
            </Text>
          </form>
        </Paper>
      </div>
    </div>
  );
}
