import { useState } from 'react';
import {
  RegistrationFormValues,
  registrationSchema,
} from '@/lib/schemas/registration.schema';
import { SanitizedUser } from '@/common/types/user.type';
import api, { setAuthCookies } from '@/lib/api';
import { useAuthStore } from '@/store/auth/auth.store';
import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { AxiosError } from 'axios';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

export const useRegistrationForm = () => {
  const [active, setActive] = useState(0);
  const { login } = useAuthStore();
  const t = useTranslations('RegisterPage');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    mode: 'onChange',
  });

  const nextStep = async () => {
    let isValid = false;
    switch (active) {
      case 0:
        isValid = await trigger(['email', 'password']);
        break;
      case 1:
        isValid = await trigger(['name']);
        break;
      case 2:
        isValid = await trigger(['organizationName']);
        break;
    }
    if (isValid) setActive((current) => (current < 3 ? current + 1 : current));
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

      // 1. Set the secure, httpOnly cookies
      await setAuthCookies(accessToken, refreshToken);

      // 2. Update the client-side store
      login(user);

      notifications.show({
        title: 'Welcome!',
        message: 'Your account has been created successfully.',
        color: 'teal',
      });

      // 3. Refresh the page to let the middleware handle redirection
      router.refresh();
    } catch (error) {
      console.error('Registration failed', error);
      let errorMessage = 'An unexpected error occurred.';

      if (error instanceof AxiosError) {
        errorMessage =
          error.response?.data?.message ||
          'An error occurred during registration.';
      }

      notifications.show({
        title: 'Registration Failed',
        message: errorMessage,
        color: 'red',
      });
    }
  };

  return {
    active,
    setActive,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    nextStep,
    prevStep,
    t,
    createUser,
  };
};
