'use client';

import { useProtectedRoute } from '@/hooks/auth/useProtectedRoute';
import { Center, Loader, Text } from '@mantine/core';
import React from 'react';

export function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useProtectedRoute();

  // Add debugging
  console.log(
    'ProtectedLayout - isLoading:',
    isLoading,
    'isAuthenticated:',
    isAuthenticated
  );

  // While we are validating the session, show a full-screen loader.
  if (isLoading) {
    console.log('Showing loader...');
    return (
      <Center style={{ height: '100vh' }}>
        <div>
          <Loader color="blue" size="lg" />
          <Text mt="md">Loading...</Text>
        </div>
      </Center>
    );
  }

  // If the session is valid, render the actual page content.
  if (isAuthenticated) {
    console.log('Rendering authenticated content...');
    return <>{children}</>;
  }

  // If not loading and not authenticated
  console.log('Not authenticated, should redirect...');
  return (
    <Center style={{ height: '100vh' }}>
      <Text>Redirecting...</Text>
    </Center>
  );
}
