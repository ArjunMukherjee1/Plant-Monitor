import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontSize, radius, spacing } from '../constants/theme';

interface Props {
  label: string;
  value: string;
  subtitle: string;
  accentColor: string;
}

export function SensorCard({ label, value, subtitle, accentColor }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
      <Text style={[styles.value, { color: accentColor }]}>{value}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  label: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  value: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: fontSize.xs,
    color: colors.textFaint,
  },
});
