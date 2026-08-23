import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import CustomInput from '../../src/components/common/CustomInput';
import CustomButton from '../../src/components/common/CustomButton';
import { registerMessOwner } from '../../src/api/authApi';
import { isValidEmail, isValidPhone, isValidPassword } from '../../src/utils/validators';
import { COLORS } from '../../src/constants/colors';

interface FormState {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export default function RegisterScreen() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({ name: '', email: '', phoneNumber: '', password: '' });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const validate = () => {
    const newErrors: Partial<FormState> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!isValidEmail(form.email)) newErrors.email = 'Enter a valid email';
    if (!isValidPhone(form.phoneNumber)) newErrors.phoneNumber = 'Enter a valid 10-digit phone number';
    if (!isValidPassword(form.password)) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

   
  const handleRegister = async () => {
    console.log("button pressed")
    if (!validate()) return;
    setLoading(true);
    try {
      await registerMessOwner(form);
      Alert.alert('Success', 'Registration successful. Please log in.', [
        { text: 'OK', onPress: () => router.replace('/(auth)/login') },
      ]);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Something went wrong. Please try again.';
      Alert.alert('Registration Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register your Mess</Text>
      <Text style={styles.subtitle}>Create an owner account to start posting menus</Text>

      <CustomInput
        label="Full Name"
        value={form.name}
        onChangeText={(text) => handleChange('name', text)}
        error={errors.name}
        placeholder="e.g. Ramesh Kumar"
      />
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
        label="Phone Number"
        value={form.phoneNumber}
        onChangeText={(text) => handleChange('phoneNumber', text)}
        error={errors.phoneNumber}
        placeholder="10-digit mobile number"
        keyboardType="phone-pad"
        maxLength={10}
      />
      <CustomInput
        label="Password"
        value={form.password}
        onChangeText={(text) => handleChange('password', text)}
        error={errors.password}
        placeholder="At least 6 characters"
        secureTextEntry
      />

      <CustomButton title="Register" onPress={handleRegister} loading={loading} />

      <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.link}>
        <Text style={styles.linkText}>
          Already have an account? <Text style={styles.linkBold}>Log in</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: COLORS.background, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.text, marginBottom: 6 },
  subtitle: { fontSize: 14, color: COLORS.textLight, marginBottom: 28 },
  link: { marginTop: 20, alignItems: 'center' },
  linkText: { color: COLORS.textLight, fontSize: 14 },
  linkBold: { color: COLORS.primary, fontWeight: '600' },
});