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
  Container,
  Group,
  Checkbox,
  Box,
} from '@mantine/core';
import { AtSign, Lock } from 'lucide-react';
import Link from 'next/link';
import { useLoginForm } from '@/hooks/auth/useLoginForm';
import { LoginFormValues } from '@/lib/schemas/login.schema';

export default function LoginPage() {
  const { register, handleSubmit, errors, isSubmitting, handleLogin } =
    useLoginForm();

  const onSubmit = async (data: LoginFormValues) => await handleLogin(data);

  return (
    <Container h="100vh">
      <Box>
        <Title order={1} ta="center" className="font-medium">
          Welcome Back!
        </Title>
        <Text c="dimmed" size="sm" ta="center" mb={30}>
          Log in to manage your projects and investments.
        </Text>
      </Box>

      <Box>
        <Paper withBorder shadow="xs" p={30} radius="md">
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap="md">
              <TextInput
                disabled={isSubmitting}
                label="Email Address"
                placeholder="you@dari-app.com"
                required
                leftSection={<AtSign size={16} />}
                {...register('email')}
                error={errors.email?.message}
              />

              <PasswordInput
                disabled={isSubmitting}
                label="Password"
                placeholder="Your password"
                required
                leftSection={<Lock size={16} />}
                {...register('password')}
                error={errors.password?.message}
              />

              <Group justify="space-between" mt={'lg'}>
                <Checkbox label="Remember me" disabled={isSubmitting} />
                <Anchor
                  component={Link}
                  href="/forgot-password"
                  size="sm"
                  className="self-end"
                >
                  Forgot Password?
                </Anchor>
              </Group>

              <Button type="submit" fullWidth mt="xl" loading={isSubmitting}>
                Sign In
              </Button>

              <Text c="dimmed" size="sm" ta="center" mt="md">
                Don&apos;t have an account?{' '}
                <Anchor component={Link} href="/register" size="sm">
                  Register Now
                </Anchor>
              </Text>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}
