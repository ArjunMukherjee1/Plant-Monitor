import React from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AppSettings } from '../api/types';
import { HealthRing } from '../components/HealthRing';
import { SensorCard } from '../components/SensorCard';
import { SparkLine } from '../components/SparkLine';
import { StatusBadge } from '../components/StatusBadge';
import { colors, fontSize, radius, spacing } from '../constants/theme';
import { useHistory } from '../hooks/useHistory';
import { useSensorData } from '../hooks/useSensorData';
import {
  formatDryingRate,
  formatLastUpdated,
  formatMoisture,
  formatTemp,
  formatWateringPrediction,
} from '../utils/formatting';
import { calculateWateringPrediction, getPlantHealth } from '../utils/plantHealth';

interface Props {
  settings: AppSettings;
}

export function DashboardScreen({ settings }: Props) {
  const { data: sensorData, isLoading, error, refetch, isRefetching } = useSensorData(settings);
  const { data: moistureHistory = [] } = useHistory(settings, settings.moistureEntityId, 24);

  const isConfigured = Boolean(settings.haUrl && settings.haToken && settings.moistureEntityId);

  if (!isConfigured) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyIcon}>🌱</Text>
        <Text style={styles.emptyTitle}>Connect your sensor</Text>
        <Text style={styles.emptySubtitle}>
          Go to Settings to enter your Home Assistant details.
        </Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.good} size="large" />
        <Text style={[styles.emptySubtitle, { marginTop: spacing.md }]}>
          Connecting to Home Assistant…
        </Text>
      </View>
    );
  }

  if (error || !sensorData) {
    const message = error?.name === 'AbortError'
      ? 'Request timed out. Is your phone on the same WiFi as Home Assistant?'
      : (error?.message ?? 'Could not reach Home Assistant.');
    return (
      <View style={styles.center}>
        <Text style={styles.emptyIcon}>⚠️</Text>
        <Text style={styles.emptyTitle}>Connection error</Text>
        <Text style={styles.emptySubtitle}>{message}</Text>
        <Text style={[styles.emptySubtitle, { marginTop: 12, fontSize: 11, opacity: 0.5 }]}>
          {settings.haUrl}
        </Text>
      </View>
    );
  }

  const moisture = sensorData.moisture?.value ?? 0;
  const temp = sensorData.temperature?.value ?? 70;
  const health = getPlantHealth(moisture, temp, settings);
  const prediction = calculateWateringPrediction(moistureHistory, settings.notificationThreshold);
  const lastUpdated = sensorData.moisture?.lastUpdated ?? new Date();

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.good} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>My Plant</Text>
        <Text style={styles.subtitle}>Updated {formatLastUpdated(lastUpdated)}</Text>
      </View>

      <View style={styles.ringContainer}>
        <HealthRing score={health.score} status={health.status} size={200} />
        <View style={styles.badgeRow}>
          <StatusBadge status={health.status} />
        </View>
        <Text style={styles.prediction}>
          {formatWateringPrediction(prediction.hoursUntilDry)}
        </Text>
      </View>

      <View style={styles.cardRow}>
        <SensorCard
          label="Moisture"
          value={formatMoisture(moisture)}
          subtitle={formatDryingRate(prediction.dryingRatePerHour)}
          accentColor={colors.moisture}
        />
        <View style={{ width: spacing.sm }} />
        {sensorData.temperature ? (
          <SensorCard
            label="Soil Temp"
            value={formatTemp(temp)}
            subtitle="Soil temperature"
            accentColor={colors.temp}
          />
        ) : (
          <View style={{ flex: 1 }} />
        )}
      </View>

      {moistureHistory.length > 1 && (
        <View style={styles.sparkCard}>
          <Text style={styles.sparkLabel}>Moisture — Last 24h</Text>
          <SparkLine data={moistureHistory} color={colors.moisture} height={52} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: 60,
  },
  center: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: fontSize.xxl,
    color: colors.text,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textFaint,
    marginTop: 2,
  },
  ringContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  badgeRow: {
    marginTop: spacing.md,
  },
  prediction: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    marginTop: spacing.sm,
  },
  cardRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  sparkCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  sparkLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
});
