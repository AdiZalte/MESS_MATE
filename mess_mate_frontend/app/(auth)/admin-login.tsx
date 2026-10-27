import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import CustomInput from '../../src/components/common/CustomInput';
import CustomButton from '../../src/components/common/CustomButton';
import { loginAdmin } from '../../src/api/adminApi';
import { isValidEmail } from '../../src/utils/validators';
import { useAuth } from '../../src/context/AuthContext';
import { COLORS } from '../../src/constants/colors';

export default function AdminLoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!isValidEmail(email) || !password) {
      setError('Enter a valid email and your password');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const data = await loginAdmin(email.trim(), password);
      // the backend returns no name/id for admins, so we fill placeholders
      await login(data.token, { id: 'admin', name: 'Admin', email: data.email }, 'ADMIN');
      router.replace('/(admin)');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not log in. Check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin Login</Text>
      <Text style={styles.subtitle}>Verify and manage registered messes</Text>

      <CustomInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="Bit*ch you dont have one so fuck off"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <CustomInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Admin password"
        secureTextEntry
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <CustomButton title="Log In" onPress={handleLogin} loading={loading} />

      <TouchableOpacity onPress={() => router.replace('/(auth)/login')} style={styles.link}>
        <Text style={styles.linkText}>Back to owner login</Text>
     </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: COLORS.background, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.text, marginBottom: 6 },
  subtitle: { fontSize: 14, color: COLORS.textLight, marginBottom: 28 },
  error: { color: COLORS.error, fontSize: 13, marginBottom: 12 },
  link: { marginTop: 20, alignItems: 'center' },
  linkText: { color: COLORS.primary, fontSize: 14, fontWeight: '600' },
});