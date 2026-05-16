import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PlantStatus } from '../api/types';
import { colors, fontSize, radius, spacing } from '../constants/theme';
import { statusToColor, statusToLabel } from '../utils/plantHealth';

interface Props {
  status: PlantStatus;
}

export function StatusBadge({ status }: Props) {
  const color = statusToColor(status);
  const label = statusToLabel(status);
  return (
    <View style={[styles.badge, { borderColor: color + '44', backgroundColor: color + '22' }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
    gap: spacing.xs,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
