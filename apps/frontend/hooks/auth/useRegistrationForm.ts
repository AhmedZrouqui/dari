import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { notifications } from '@mantine/notifications';
import { AxiosError } from 'axios';
import api, { setAuthCookies } from '@/lib/api';
import { useAuthStore } from '@/store/auth/auth.store';
import {
  RegistrationFormValues,
  registrationSchema,
} from '@/lib/schemas/registration.schema';
import { AccountType } from '@dari/types';
import { SanitizedUser } from '@/common/types/user.type';

export const useRegistrationForm = () => {
  const [active, setActive] = useState(0);
  const { login } = useAuthStore();
  const t = useTranslations('RegisterPage');
  const router = useRouter();

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    mode: 'onChange',
    defaultValues: {
      accountType: AccountType.DEVELOPER, // Default selection
    },
  });

  const accountType = form.watch('accountType');
  const totalSteps = accountType === AccountType.DEVELOPER ? 3 : 2;

  const nextStep = async () => {
    let isValid = false;
    switch (active) {
      case 0:
        isValid = await form.trigger(['accountType', 'email', 'password']);
        break;
      case 1:
        isValid = await form.trigger(['name']);
        break;
      case 2:
        isValid = await form.trigger(['organizationName']);
        break;
    }
    if (isValid) {
      // Prevent going past the last step for the current account type
      const lastStepIndex = totalSteps - 1;
      setActive((current) => (current < lastStepIndex ? current + 1 : current));
    }
  };

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const createUser = async (data: RegistrationFormValues) => {
    try {
      const response = await api.post<{
        user: SanitizedUser;
        accessToken: string;
        refreshToken: string;
      }>('/auth/register', data);
      const { user, accessToken, refreshToken } = response.data;
      await setAuthCookies(accessToken, refreshToken);
      login(user);
      notifications.show({
        title: 'Welcome!',
        message: 'Your account has been created successfully.',
        color: 'teal',
      });
      router.refresh();
    } catch (error) {
      let errorMessage = 'An unexpected error occurred.';
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || 'Registration failed.';
      }
      notifications.show({
        title: 'Registration Failed',
        message: errorMessage,
        color: 'red',
      });
    }
  };

  return {
    form,
    nextStep,
    prevStep,
    active,
    setActive,
    t,
    createUser,
    totalSteps,
    accountType,
  };
};
