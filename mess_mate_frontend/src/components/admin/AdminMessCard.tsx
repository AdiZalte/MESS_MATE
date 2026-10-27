import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { AdminMess } from '../../api/adminApi';
import { COLORS } from '../../constants/colors';

interface Props {
  mess: AdminMess;
  busy: boolean;
  onVerify: () => void;
  onUnverify: () => void;
  onDelete: () => void;
}

export default function AdminMessCard({ mess, busy, onVerify, onUnverify, onDelete }: Props) {
  const created = mess.createdAt ? new Date(mess.createdAt).toLocaleDateString() : '';

  return (
    <View style={styles.card}>
      {mess.coverImageUrl1 ? (
        <Image source={{ uri: mess.coverImageUrl1 }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Text style={styles.muted}>No image</Text>
        </View>
      )}

      <View style={styles.headerRow}>
        <Text style={styles.name}>{mess.name}</Text>
        <View style={[styles.badge, mess.isVerified ? styles.badgeGreen : styles.badgeYellow]}>
          <Text style={styles.badgeText}>{mess.isVerified ? 'Verified' : 'Pending'}</Text>
        </View>
      </View>

      <Text style={styles.line}>
        {mess.address}, {mess.locality ? `${mess.locality}, ` : ''}{mess.city}
      </Text>
      {mess.avgPricePerMeal != null && <Text style={styles.line}>₹{mess.avgPricePerMeal} per meal</Text>}
      {created ? <Text style={styles.muted}>Registered {created}</Text> : null}

      <View style={styles.ownerBox}>
        <Text style={styles.ownerTitle}>Owner</Text>
        <Text style={styles.line}>{mess.ownerName}</Text>
        <Text style={styles.line}>{mess.ownerEmail}</Text>
        {mess.ownerPhone ? (
          <TouchableOpacity onPress={() => Linking.openURL(`tel:${mess.ownerPhone}`)}>
            <Text style={styles.phone}>{mess.ownerPhone} (tap to call)</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {busy ? (
        <ActivityIndicator color={COLORS.primary} style={{ marginTop: 12 }} />
      ) : (
        <View style={styles.actions}>
          {mess.isVerified ? (
            <TouchableOpacity style={[styles.btn, styles.btnOutline]} onPress={onUnverify}>
              <Text style={styles.btnOutlineText}>Unverify</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={onVerify}>
              <Text style={styles.btnPrimaryText}>Verify</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[styles.btn, styles.btnDanger]} onPress={onDelete}>
            <Text style={styles.btnDangerText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: COLORS.border },
  image: { width: '100%', height: 150, borderRadius: 8, marginBottom: 10 },
  imagePlaceholder: { backgroundColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  name: { fontSize: 18, fontWeight: '700', color: COLORS.text, flex: 1 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  badgeGreen: { backgroundColor: '#DFF5E1' },
  badgeYellow: { backgroundColor: '#FFF3CD' },
  badgeText: { fontSize: 12, fontWeight: '600', color: COLORS.text },
  line: { fontSize: 14, color: COLORS.text, marginTop: 3 },
  muted: { fontSize: 12, color: COLORS.textLight, marginTop: 3 },
  ownerBox: { marginTop: 10, padding: 10, backgroundColor: '#FAFAFA', borderRadius: 8 },
  ownerTitle: { fontSize: 12, fontWeight: '700', color: COLORS.textLight, textTransform: 'uppercase' },
  phone: { fontSize: 14, color: COLORS.primary, marginTop: 3, fontWeight: '600' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  btn: { flex: 1, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  btnPrimary: { backgroundColor: COLORS.primary },
  btnPrimaryText: { color: '#fff', fontWeight: '700' },
  btnOutline: { borderWidth: 1, borderColor: COLORS.primary },
  btnOutlineText: { color: COLORS.primary, fontWeight: '700' },
  btnDanger: { borderWidth: 1, borderColor: COLORS.error },
  btnDangerText: { color: COLORS.error, fontWeight: '700' },
});