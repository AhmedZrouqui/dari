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
  SegmentedControl,
} from '@mantine/core';
import { AtSign, Lock, User as UserIcon, Building } from 'lucide-react';
import Link from 'next/link';
import { useRegistrationForm } from '@/hooks/auth/useRegistrationForm';
import { Controller } from 'react-hook-form';
import { AccountType } from '@dari/types';

export default function RegisterPage() {
  const {
    form,
    nextStep,
    prevStep,
    active,
    setActive,
    t,
    createUser,
    totalSteps,
    accountType,
  } = useRegistrationForm();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-2xl">
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
        <Paper withBorder shadow="md" p="xl" radius="lg">
          <form onSubmit={form.handleSubmit(createUser)}>
            <Stepper
              active={active}
              onStepClick={setActive}
              allowNextStepsSelect={false}
            >
              <Stepper.Step
                label={t('step1.label')}
                description={t('step1.description')}
              >
                <Stack gap="lg" mt="xl">
                  <Controller
                    name="accountType"
                    control={form.control}
                    render={({ field }) => (
                      <SegmentedControl
                        {...field}
                        fullWidth
                        data={[
                          {
                            label: 'I am a Developer',
                            value: AccountType.DEVELOPER,
                          },
                          {
                            label: 'I am an Investor',
                            value: AccountType.INVESTOR,
                          },
                        ]}
                      />
                    )}
                  />
                  <TextInput
                    label={t('step1.emailLabel')}
                    placeholder="you@dari-app.com"
                    leftSection={<AtSign size={16} />}
                    {...form.register('email')}
                    error={form.formState.errors.email?.message}
                  />
                  <PasswordInput
                    label={t('step1.passwordLabel')}
                    placeholder="••••••••"
                    leftSection={<Lock size={16} />}
                    {...form.register('password')}
                    error={form.formState.errors.password?.message}
                  />
                </Stack>
              </Stepper.Step>

              <Stepper.Step
                label={t('step2.label')}
                description={t('step2.description')}
              >
                <Stack gap="lg" mt="xl">
                  <TextInput
                    label={t('step2.nameLabel')}
                    placeholder="e.g., Yassine Bennani"
                    leftSection={<UserIcon size={16} />}
                    {...form.register('name')}
                    error={form.formState.errors.name?.message}
                  />
                </Stack>
              </Stepper.Step>

              {accountType === AccountType.DEVELOPER && (
                <Stepper.Step
                  label={t('step3.label')}
                  description={t('step3.description')}
                >
                  <Stack gap="lg" mt="xl">
                    <TextInput
                      label={t('step3.orgNameLabel')}
                      placeholder="e.g., Bennani Developments"
                      leftSection={<Building size={16} />}
                      {...form.register('organizationName')}
                      error={form.formState.errors.organizationName?.message}
                    />
                    <Text size="xs" c="dimmed">
                      {t('step3.orgNameHint')}
                    </Text>
                  </Stack>
                </Stepper.Step>
              )}

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

              {active < totalSteps - 1 ? (
                <Button onClick={nextStep}>{t('nextButton')}</Button>
              ) : (
                <Button type="submit" loading={form.formState.isSubmitting}>
                  {t('createAccountButton')}
                </Button>
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
