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
import { RegistrationFormValues } from '@/lib/schemas/registration.schema';
import { useRegistrationForm } from '@/hooks/auth/useRegistrationForm';
import { useEffect } from 'react';

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

  useEffect(() => {
    console.log('errors', errors);
  }, [errors]);

  const onSubmit = async (data: RegistrationFormValues) => {
    console.log('clicked');

    await createUser(data);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="max-w-xl w-full">
        <Title order={1} className="text-center text-dari-blue-700 mb-2">
          {t('title')}
        </Title>
        <Text c="dimmed" size="sm" ta="center" mb={30}>
          {t('subtitle')}
        </Text>

        <Paper withBorder shadow="md" p={30} radius="md">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stepper active={active} onStepClick={setActive}>
              {/* STEP 1: ACCOUNT */}
              <Stepper.Step
                label={t('step1.label')}
                description={t('step1.description')}
                key={'step-1'}
              >
                <Stack gap="md" mt="xl">
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
                <Stack gap="md" mt="xl">
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
                <Stack gap="md" mt="xl">
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

              <Stepper.Completed>{t('completedText')}</Stepper.Completed>
            </Stepper>

            <Group justify="space-between" mt="xl">
              {active > 0 ? (
                <Button variant="default" onClick={prevStep}>
                  {t('backButton')}
                </Button>
              ) : (
                <div />
              )}

              {active < 3 ? (
                <Button onClick={nextStep}>
                  {active === 2 ? t('createAccountButton') : t('nextButton')}
                </Button>
              ) : (
                <Button type="submit" loading={isSubmitting}>
                  {t('createAccountButton')}
                </Button>
              )}
            </Group>
            <Text c="dimmed" size="sm" ta="center" mt="xl">
              {t('loginPrompt')}{' '}
              <Anchor component={Link} href="/auth/login" size="sm">
                {t('loginLink')}
              </Anchor>
            </Text>
          </form>
        </Paper>
      </div>
    </div>
  );
}
