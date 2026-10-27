import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '../src/context/AuthContext';
import { COLORS } from '../src/constants/colors';

export default function Index() {
const { ownerToken, role, isLoading } = useAuth();

  if (!ownerToken) 
    return <Redirect href="/(auth)/login" />;

  return  <Redirect href={role === 'ADMIN' ? '/(admin)' : '/(app)/dashboard'} />;

  // if (isLoading) {
  //   return (
  //     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
  //       <ActivityIndicator size="large" color={COLORS.primary} />
  //     </View>
  //   );
  // }

  // return <Redirect href={ownerToken ? '/(app)/dashboard' : '/(auth)/login'} />;
}