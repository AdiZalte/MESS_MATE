import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import CustomInput from '../../src/components/common/CustomInput';
import CustomButton from '../../src/components/common/CustomButton';
import { loginMessOwner } from '../../src/api/authApi';
import { isValidEmail } from '../../src/utils/validators';
import { useAuth } from '../../src/context/AuthContext';
import { COLORS } from '../../src/constants/colors';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (key: 'email' | 'password', value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!isValidEmail(form.email)) newErrors.email = 'Enter a valid email';
    if (!form.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await loginMessOwner(form);
      await login(data.token, { id: data.messOwnerId, name: data.name, email: data.email });
      router.replace('/(app)/dashboard');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Invalid email or password';
      Alert.alert('Login Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Log in to manage your mess menu</Text>

      <CustomInput
        label="Email"
        value={form.email}
        onChangeText={(text) => handleChange('email', text)}
        error={errors.email}
        placeholder="you@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <CustomInput
        label="Password"
        value={form.password}
        onChangeText={(text) => handleChange('password', text)}
        error={errors.password}
        placeholder="Your password"
        secureTextEntry
      />

      <CustomButton title="Log In" onPress={handleLogin} loading={loading} />

      <TouchableOpacity onPress={() => router.push('/(auth)/register')} style={styles.link}>

        <Text style={styles.linkText}>
          Don't have an account? <Text style={styles.linkBold}>Register</Text>
  
        </Text>
         <TouchableOpacity onPress={() => router.push('/(auth)/admin-login')} style={styles.link}>
            <Text style={styles.linkText}>Admin login</Text>
          </TouchableOpacity>

        
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: COLORS.background, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.text, marginBottom: 6 },
  subtitle: { fontSize: 14, color: COLORS.textLight, marginBottom: 28 },
  link: { marginTop: 20, alignItems: 'center' },
  linkText: { color: COLORS.textLight, fontSize: 14 },
  linkBold: { color: COLORS.primary, fontWeight: '600' },
});