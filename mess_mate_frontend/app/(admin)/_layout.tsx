import React from 'react';
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../src/context/AuthContext';

export default function AdminLayout() {
  const { role, isLoading } = useAuth();

  if (isLoading) return null; // wait until AsyncStorage has been read

  if (role !== 'ADMIN') return <Redirect href="/(auth)/admin-login" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}