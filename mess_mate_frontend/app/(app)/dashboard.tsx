import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { getMyMess, MessResponse } from '../../src/api/messApi';
import { useAuth } from '../../src/context/AuthContext';
import CustomButton from '../../src/components/common/CustomButton';
import { COLORS } from '../../src/constants/colors';

export default function Dashboard() {
  const router = useRouter();
  const { ownerInfo, logout } = useAuth();

  const [mess, setMess] = useState<MessResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadMess = async () => {
  setLoading(true);
  setError(false);
  try {
    const result = await getMyMess();
    setMess(result);
  } catch (err: any) {
    if (err.response?.status === 401 || err.response?.status === 403) {
      // Token is no longer valid — force back to login instead of showing a dead-end error
      await logout();
      router.replace('/(auth)/login');
      return;
    }
    setError(true);
  } finally {
    setLoading(false);
  }
};

  // Re-check every time this screen comes back into focus —
  // e.g. after the owner finishes the create-mess form and navigates back here.
  useFocusEffect(
    useCallback(() => {
      loadMess();
    }, [])
  );

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Something went wrong loading your dashboard</Text>
        <CustomButton title="Retry" onPress={loadMess} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi, {ownerInfo?.name}</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </View>

      {mess === null ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No mess registered yet</Text>
          <Text style={styles.emptySubtitle}>
            Set up your mess profile to start posting daily menus
          </Text>
          <CustomButton
            title="Register Your Mess"
            onPress={() => router.push('/(app)/create-mess')}
          />
        </View>
      ) : (
        <View style={styles.messCard}>
          {mess.coverImageUrl1 ? (
            <Image source={{ uri: mess.coverImageUrl1 }} style={styles.coverImage} />
          ) : (
            <View style={[styles.coverImage, styles.coverImagePlaceholder]}>
              <Text style={styles.coverImagePlaceholderText}>No cover image</Text>
            </View>
          )}

          <Text style={styles.messName}>{mess.name}</Text>
          <Text style={styles.messAddress}>{mess.address}, {mess.city}</Text>

          <View style={styles.statusRow}>
            <View style={[styles.badge, mess.isActive ? styles.badgeActive : styles.badgeInactive]}>
              <Text style={styles.badgeText}>{mess.isActive ? 'Active' : 'Paused'}</Text>
            </View>
            <View style={[styles.badge, mess.isVerified ? styles.badgeActive : styles.badgePending]}>
              <Text style={styles.badgeText}>{mess.isVerified ? 'Verified' : 'Pending verification'}</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <Text style={styles.statText}>⭐ {mess.avgRating.toFixed(1)} ({mess.totalRatings} ratings)</Text>
          </View>

          <CustomButton title="Manage Weekly Menu" onPress={() => router.push('/(app)/weekly-menu')} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, backgroundColor: COLORS.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background, gap: 12 },
  errorText: { color: COLORS.error, fontSize: 14, textAlign: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  greeting: { fontSize: 20, fontWeight: '700', color: COLORS.text },
  logoutText: { color: COLORS.primary, fontSize: 14, fontWeight: '600' },
  emptyState: { alignItems: 'center', marginTop: 60, gap: 8 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: COLORS.text },
  emptySubtitle: { fontSize: 14, color: COLORS.textLight, textAlign: 'center', marginBottom: 16, paddingHorizontal: 20 },
  messCard: { gap: 10 },
  coverImage: { width: '100%', height: 180, borderRadius: 12 },
  coverImagePlaceholder: { backgroundColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  coverImagePlaceholderText: { color: COLORS.textLight },
  messName: { fontSize: 22, fontWeight: '700', color: COLORS.text, marginTop: 8 },
  messAddress: { fontSize: 14, color: COLORS.textLight },
  statusRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  badgeActive: { backgroundColor: '#DFF5E1' },
  badgeInactive: { backgroundColor: '#F0F0F0' },
  badgePending: { backgroundColor: '#FFF3CD' },
  badgeText: { fontSize: 12, fontWeight: '600', color: COLORS.text },
  statsRow: { marginTop: 4 },
  statText: { fontSize: 14, color: COLORS.text },
});