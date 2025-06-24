import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { notifications } from '@mantine/notifications';
import { AxiosError } from 'axios';

import api, { setAuthCookies } from '@/lib/api';
import { useAuthStore } from '@/store/auth/auth.store';
import { LoginFormValues, loginSchema } from '@/lib/schemas/login.schema';
import { SanitizedUser } from '@/common/types/user.type';

export const useLoginForm = () => {
  const { login } = useAuthStore();
  const router = useRouter();
  const t = useTranslations('LoginPage');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const handleLogin = async (data: LoginFormValues) => {
    try {
      const response = await api.post<{
        user: SanitizedUser;
        accessToken: string; // Corrected token name to match backend
        refreshToken: string;
      }>('/auth/login', data);

      const { user, accessToken, refreshToken } = response.data;

      // 1. Set the secure, httpOnly cookies via our API route
      await setAuthCookies(accessToken, refreshToken);

      // 2. Update the client-side store with the user's info
      login(user);

      notifications.show({
        title: 'Login Successful',
        message: `Welcome back, ${user.name || user.email}!`,
        color: 'teal',
      });

      // 3. THE FIX: Refresh the current page.
      // This re-triggers the middleware with the new cookies set.
      // The middleware will see you are on `/auth/login` and are now authenticated,
      // and it will correctly redirect you to the dashboard.
      router.refresh();
    } catch (error) {
      let errorMessage = 'Invalid credentials or server error.';
      if (error instanceof AxiosError) {
        errorMessage = error.response?.data?.message || 'Invalid credentials.';
      }
      notifications.show({
        title: 'Login Failed',
        message: errorMessage,
        color: 'red',
      });
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    t,
    handleLogin,
  };
};
