import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../src/constants/colors';

export default function WeeklyMenuScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Weekly menu setup — coming next</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background },
  text: { fontSize: 16, color: COLORS.text },
});