import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import AdminMessCard from '../../src/components/admin/AdminMessCard';
import { AdminMess, MessFilter, getAdminMesses, verifyMess, unverifyMess, deleteMess } from '../../src/api/adminApi';
import { confirmAction } from '../../src/utils/confirm';
import { useAuth } from '../../src/context/AuthContext';
import { COLORS } from '../../src/constants/colors';

const TABS: { key: MessFilter; label: string }[] = [
  { key: 'pending', label: 'Pending' },
  { key: 'verified', label: 'Verified' },
  { key: 'all', label: 'All' },
];

export default function AdminHome() {
  const router = useRouter();
  const { logout } = useAuth();

  const [filter, setFilter] = useState<MessFilter>('pending');
  const [messes, setMesses] = useState<AdminMess[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  // Token expired or not an admin -> back to the admin login
  const handleAuthFailure = async () => {
    await logout();
    router.replace('/(auth)/admin-login');
  };

  const load = async (pullToRefresh = false) => {
    pullToRefresh ? setRefreshing(true) : setLoading(true);
    setError('');
    try {
      setMesses(await getAdminMesses(filter));
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 401 || status === 403) return handleAuthFailure();
      setError('Could not load messes. Pull down to retry.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Runs on first show, when we return to this screen, and when `filter` changes
  useFocusEffect(
    useCallback(() => {
      load();
    }, [filter])
  );

  const runAction = async (mess: AdminMess, action: 'verify' | 'unverify' | 'delete') => {
    if (action === 'delete') {
      const ok = await confirmAction(
        'Delete this mess?',
        `"${mess.name}" and all its menus and ratings will be permanently removed. The owner's account stays.`,
        'Delete'
      );
      if (!ok) return;
    }

    setBusyId(mess.id);
    try {
      if (action === 'verify') await verifyMess(mess.id);
      if (action === 'unverify') await unverifyMess(mess.id);
      if (action === 'delete') await deleteMess(mess.id);
      await load(true); // re-fetch so the card moves to the right tab / disappears
    } catch (err: any) {
      const status = err.response?.status;
      if (status === 401 || status === 403) return handleAuthFailure();
      setError(err.response?.data?.message || 'That action failed. Try again.');
    } finally {
      setBusyId(null);
    }
  };

  const handleLogout = async () => {
  await logout();
  router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Admin</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logout}>Log out</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, filter === tab.key && styles.tabActive]}
            onPress={() => setFilter(tab.key)}
          >
            <Text style={[styles.tabText, filter === tab.key && styles.tabTextActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={messes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshing={refreshing}
          onRefresh={() => load(true)}
          ListEmptyComponent={<Text style={styles.empty}>Nothing here. 🎉</Text>}
          renderItem={({ item }) => (
            <AdminMessCard
              mess={item}
              busy={busyId === item.id}
              onVerify={() => runAction(item, 'verify')}
              onUnverify={() => runAction(item, 'unverify')}
              onDelete={() => runAction(item, 'delete')}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingTop: 48 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 12 },
  title: { fontSize: 24, fontWeight: '700', color: COLORS.text },
  logout: { color: COLORS.primary, fontWeight: '600' },
  tabs: { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 12 },
  tab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border },
  tabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  tabText: { color: COLORS.text, fontWeight: '600' },
  tabTextActive: { color: '#fff' },
  error: { color: COLORS.error, paddingHorizontal: 20, marginBottom: 8 },
  list: { paddingHorizontal: 20, paddingBottom: 40 },
  empty: { textAlign: 'center', color: COLORS.textLight, marginTop: 40 },
});