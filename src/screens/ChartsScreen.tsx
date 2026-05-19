import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { AppSettings, HistoryPoint } from '../api/types';
import { colors, fontSize, radius, spacing } from '../constants/theme';
import { useHistory } from '../hooks/useHistory';
import { formatMoisture, formatTemp } from '../utils/formatting';

const RANGE_OPTIONS = [
  { label: '6h', hours: 6 },
  { label: '24h', hours: 24 },
  { label: '7d', hours: 168 },
];

const SCREEN_WIDTH = Dimensions.get('window').width;

interface Props {
  settings: AppSettings;
}

function toChartData(history: HistoryPoint[]) {
  return {
    labels: history.map(() => ''),
    datasets: [{ data: history.map((p) => p.value) }],
  };
}

function OptimalBand({ min, max, data, color }: { min: number; max: number; data: HistoryPoint[]; color: string }) {
  if (data.length === 0) return null;
  return (
    <View style={[styles.band, { backgroundColor: color + '18' }]}>
      <Text style={[styles.bandLabel, { color }]}>Optimal: {min}–{max}</Text>
    </View>
  );
}

export function ChartsScreen({ settings }: Props) {
  const [hoursBack, setHoursBack] = useState(24);

  const { data: moistureHistory = [], isLoading: mLoading } = useHistory(
    settings, settings.moistureEntityId, hoursBack
  );
  const { data: tempHistory = [], isLoading: tLoading } = useHistory(
    settings, settings.temperatureEntityId, hoursBack
  );

  const isConfigured = Boolean(settings.haUrl && settings.haToken && settings.moistureEntityId);

  if (!isConfigured) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>Configure your sensor in Settings to see charts.</Text>
      </View>
    );
  }

  const chartWidth = SCREEN_WIDTH - spacing.lg * 2;

  const baseConfig = {
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    labelColor: () => colors.textFaint,
    strokeWidth: 3,
    decimalPlaces: 1,
    propsForDots: { r: '0' },
  };

  const moistureConfig = { ...baseConfig, color: () => colors.moisture };
  const tempConfig     = { ...baseConfig, color: () => colors.temp };

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <View style={styles.rangeRow}>
        {RANGE_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.hours}
            style={[styles.rangeBtn, hoursBack === opt.hours && styles.rangeBtnActive]}
            onPress={() => setHoursBack(opt.hours)}
          >
            <Text style={[styles.rangeBtnText, hoursBack === opt.hours && styles.rangeBtnTextActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Moisture */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Soil Moisture</Text>
        <OptimalBand min={settings.optimalMoistureMin} max={settings.optimalMoistureMax} data={moistureHistory} color={colors.moisture} />
        {moistureHistory.length > 1 ? (
          <LineChart
            data={toChartData(moistureHistory)}
            width={chartWidth}
            height={180}
            chartConfig={moistureConfig}
            bezier
            withDots={false}
            withInnerLines={false}
            withOuterLines={false}
            segments={4}
            formatXLabel={() => ''}
            formatYLabel={(v) => formatMoisture(parseFloat(v))}
            style={{ marginLeft: -spacing.md }}
          />
        ) : (
          <View style={styles.noData}>
            <Text style={styles.noDataText}>{mLoading ? 'Loading…' : 'Not enough history yet — check back soon'}</Text>
          </View>
        )}
      </View>

      {/* Temperature */}
      {settings.temperatureEntityId ? (
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Soil Temperature</Text>
          <OptimalBand min={settings.optimalTempMin} max={settings.optimalTempMax} data={tempHistory} color={colors.temp} />
          {tempHistory.length > 1 ? (
            <LineChart
              data={toChartData(tempHistory)}
              width={chartWidth}
              height={180}
              chartConfig={tempConfig}
              withDots={false}
              withInnerLines={false}
              withOuterLines={false}
              segments={4}
              formatXLabel={() => ''}
              formatYLabel={(v) => formatTemp(parseFloat(v))}
              style={{ marginLeft: -spacing.md }}
            />
          ) : (
            <View style={styles.noData}>
              <Text style={styles.noDataText}>{tLoading ? 'Loading…' : 'Not enough history yet — check back soon'}</Text>
            </View>
          )}
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  content: { padding: spacing.lg, paddingBottom: 60 },
  center: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  emptyText: { color: colors.textMuted, fontSize: fontSize.md, textAlign: 'center' },
  rangeRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  rangeBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rangeBtnActive: { backgroundColor: colors.good + '22', borderColor: colors.good },
  rangeBtnText: { fontSize: fontSize.sm, color: colors.textMuted, fontWeight: '600' },
  rangeBtnTextActive: { color: colors.good },
  chartCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  chartTitle: { fontSize: fontSize.md, color: colors.text, fontWeight: '600', marginBottom: spacing.sm },
  band: {
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginBottom: spacing.sm,
  },
  bandLabel: { fontSize: fontSize.xs, fontWeight: '600' },
  noData: { height: 180, alignItems: 'center', justifyContent: 'center' },
  noDataText: { color: colors.textFaint, fontSize: fontSize.sm },
});
