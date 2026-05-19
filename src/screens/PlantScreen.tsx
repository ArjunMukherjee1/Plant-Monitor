import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AppSettings } from '../api/types';
import { PlantPicker } from '../components/PlantPicker';
import { colors, fontSize, radius, spacing } from '../constants/theme';
import { getPlantById, Plant } from '../data/plants';
import { useHistory } from '../hooks/useHistory';
import { calculateMilestone } from '../utils/milestone';

interface Props {
  settings: AppSettings;
  onSave: (updates: Partial<AppSettings>) => Promise<void>;
}

function formatDate(isoString: string): string {
  if (!isoString) return '—';
  const d = new Date(isoString);
  if (isNaN(d.getTime())) return isoString;
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatEstimatedDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function isValidIso(str: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(str)) return false;
  const d = new Date(str);
  return !isNaN(d.getTime());
}

export function PlantScreen({ settings, onSave }: Props) {
  const plant: Plant | undefined = settings.plantTypeId
    ? getPlantById(settings.plantTypeId)
    : undefined;

  const [pickerVisible, setPickerVisible] = useState(false);
  const [editingDate, setEditingDate] = useState(false);
  const [dateInput, setDateInput] = useState(settings.plantingDate);
  const [dateError, setDateError] = useState('');

  const { data: moistureHistory = [] } = useHistory(
    settings,
    settings.moistureEntityId,
    // Fetch enough history to cover all days since planting (up to 90 days)
    Math.min(
      settings.plantingDate
        ? Math.ceil(
            (Date.now() - new Date(settings.plantingDate).getTime()) /
              3_600_000,
          ) + 1
        : 24,
      2160, // 90 days
    ),
  );

  async function handleSelectPlant(selected: Plant) {
    setPickerVisible(false);
    await onSave({
      plantTypeId: selected.id,
      optimalMoistureMin: selected.optimalMoistureMin,
      optimalMoistureMax: selected.optimalMoistureMax,
      optimalTempMin: selected.optimalTempMin,
      optimalTempMax: selected.optimalTempMax,
      currentStageIndex: 0,
    });
  }

  async function handleRemovePlant() {
    await onSave({
      plantTypeId: '',
      plantingDate: '',
      currentStageIndex: 0,
    });
  }

  async function handleSaveDate() {
    if (!isValidIso(dateInput)) {
      setDateError('Use YYYY-MM-DD format (e.g. 2025-03-15)');
      return;
    }
    setDateError('');
    setEditingDate(false);
    await onSave({ plantingDate: dateInput });
  }

  async function handleStageChange(delta: number) {
    if (!plant) return;
    const next = Math.max(
      0,
      Math.min(plant.growthStages.length - 1, settings.currentStageIndex + delta),
    );
    await onSave({ currentStageIndex: next });
  }

  // ── Empty state ──────────────────────────────────────────────────────────────
  if (!plant) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🌱</Text>
        <Text style={styles.emptyTitle}>Choose your plant</Text>
        <Text style={styles.emptySubtitle}>
          Track growth milestones, care tips, and stress days for any plant.
        </Text>
        <TouchableOpacity
          style={styles.selectBtn}
          onPress={() => setPickerVisible(true)}
        >
          <Text style={styles.selectBtnText}>Select Plant</Text>
        </TouchableOpacity>

        <PlantPicker
          visible={pickerVisible}
          onSelect={handleSelectPlant}
          onClose={() => setPickerVisible(false)}
        />
      </View>
    );
  }

  // ── Milestone calculation ───────────────────────────────────────────────────
  const plantingDate = settings.plantingDate
    ? new Date(settings.plantingDate)
    : null;

  const milestone =
    plantingDate && !isNaN(plantingDate.getTime())
      ? calculateMilestone(
          plant,
          plantingDate,
          settings.currentStageIndex,
          moistureHistory,
          settings.optimalMoistureMin,
          settings.optimalMoistureMax,
        )
      : null;

  const currentStageName =
    plant.growthStages[
      Math.min(settings.currentStageIndex, plant.growthStages.length - 1)
    ];

  // ── Plant selected view ────────────────────────────────────────────────────
  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={styles.plantHeader}>
        <View style={styles.plantHeaderLeft}>
          <Text style={styles.plantName}>{plant.name}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{plant.category}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => setPickerVisible(true)}
          style={styles.changeBtn}
        >
          <Text style={styles.changeBtnText}>Change</Text>
        </TouchableOpacity>
      </View>

      {/* Planting date */}
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.rowLabel}>Planted</Text>
          {!editingDate ? (
            <View style={styles.rowRight}>
              <Text style={styles.rowValue}>
                {settings.plantingDate ? formatDate(settings.plantingDate) : 'Not set'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setDateInput(settings.plantingDate);
                  setDateError('');
                  setEditingDate(true);
                }}
                style={styles.editBtn}
              >
                <Text style={styles.editBtnText}>Edit</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.dateEditRow}>
              <TextInput
                style={[styles.dateInput, dateError ? styles.dateInputError : null]}
                value={dateInput}
                onChangeText={(v) => {
                  setDateInput(v);
                  setDateError('');
                }}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textFaint}
                autoCapitalize="none"
                keyboardType="numbers-and-punctuation"
              />
              <TouchableOpacity onPress={handleSaveDate} style={styles.saveSmallBtn}>
                <Text style={styles.saveSmallBtnText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setEditingDate(false);
                  setDateError('');
                }}
                style={styles.cancelBtn}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        {dateError ? <Text style={styles.dateError}>{dateError}</Text> : null}
      </View>

      {/* Growth stage */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>Growth Stage</Text>
        <View style={styles.stageRow}>
          <TouchableOpacity
            style={[
              styles.arrowBtn,
              settings.currentStageIndex === 0 && styles.arrowBtnDisabled,
            ]}
            onPress={() => handleStageChange(-1)}
            disabled={settings.currentStageIndex === 0}
          >
            <Text style={styles.arrowBtnText}>‹</Text>
          </TouchableOpacity>
          <View style={styles.stageCenter}>
            <Text style={styles.stageName}>{currentStageName}</Text>
            <Text style={styles.stageCounter}>
              {settings.currentStageIndex + 1} / {plant.growthStages.length}
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.arrowBtn,
              settings.currentStageIndex >= plant.growthStages.length - 1 &&
                styles.arrowBtnDisabled,
            ]}
            onPress={() => handleStageChange(1)}
            disabled={settings.currentStageIndex >= plant.growthStages.length - 1}
          >
            <Text style={styles.arrowBtnText}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Milestone card */}
      {milestone ? (
        <View style={styles.milestoneCard}>
          <Text style={styles.milestoneTitle}>{plant.milestoneLabel}</Text>

          {/* Progress bar */}
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${milestone.progressPercent}%` as unknown as number },
              ]}
            />
          </View>
          <Text style={styles.progressPercent}>{milestone.progressPercent}%</Text>

          {milestone.daysRemaining === null ? (
            <Text style={styles.milestoneReached}>Milestone reached! 🎉</Text>
          ) : (
            <Text style={styles.milestoneDays}>
              {milestone.daysElapsed} days elapsed ·{' '}
              {milestone.daysRemaining} days remaining
            </Text>
          )}

          {milestone.stressDaysCount > 0 && (
            <Text style={styles.stressWarning}>
              ⚠️ {milestone.stressDaysCount} stress{' '}
              {milestone.stressDaysCount === 1 ? 'day' : 'days'} detected —
              estimate adjusted
            </Text>
          )}

          {milestone.estimatedDate && (
            <Text style={styles.estimatedDate}>
              Est. {plant.milestoneLabel}:{' '}
              {formatEstimatedDate(milestone.estimatedDate)}
            </Text>
          )}
        </View>
      ) : (
        <View style={styles.milestoneCard}>
          <Text style={styles.milestoneTitle}>{plant.milestoneLabel}</Text>
          <Text style={styles.milestoneDays}>Set a planting date to track progress.</Text>
        </View>
      )}

      {/* Care tips */}
      <View style={styles.tipsRow}>
        <View style={[styles.tipCard, { marginRight: spacing.sm / 2 }]}>
          <Text style={styles.tipIcon}>💧</Text>
          <Text style={styles.tipTitle}>Watering</Text>
          <Text style={styles.tipBody}>{plant.wateringTip}</Text>
        </View>
        <View style={[styles.tipCard, { marginLeft: spacing.sm / 2 }]}>
          <Text style={styles.tipIcon}>🌡️</Text>
          <Text style={styles.tipTitle}>Temperature</Text>
          <Text style={styles.tipBody}>{plant.tempTip}</Text>
        </View>
      </View>

      {/* Remove link */}
      <TouchableOpacity onPress={handleRemovePlant} style={styles.removeBtn}>
        <Text style={styles.removeBtnText}>Remove plant</Text>
      </TouchableOpacity>

      <PlantPicker
        visible={pickerVisible}
        onSelect={handleSelectPlant}
        onClose={() => setPickerVisible(false)}
      />
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

  // Empty state
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  emptyIcon: {
    fontSize: 52,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    color: colors.text,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: fontSize.md,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  selectBtn: {
    backgroundColor: colors.good,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  selectBtnText: {
    color: '#0D1117',
    fontSize: fontSize.md,
    fontWeight: '700',
  },

  // Plant header
  plantHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  plantHeaderLeft: {
    flex: 1,
  },
  plantName: {
    fontSize: fontSize.xxl,
    color: colors.text,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.moisture + '22',
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.moisture + '55',
  },
  categoryBadgeText: {
    fontSize: fontSize.xs,
    color: colors.moisture,
    fontWeight: '600',
  },
  changeBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  changeBtnText: {
    fontSize: fontSize.sm,
    color: colors.good,
    fontWeight: '600',
  },

  // Cards
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLabel: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    fontWeight: '500',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  rowValue: {
    fontSize: fontSize.md,
    color: colors.text,
  },
  editBtn: {
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
  },
  editBtnText: {
    fontSize: fontSize.sm,
    color: colors.good,
    fontWeight: '600',
  },
  dateEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
    marginLeft: spacing.md,
  },
  dateInput: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs + 2,
    color: colors.text,
    fontSize: fontSize.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateInputError: {
    borderColor: colors.critical,
  },
  saveSmallBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.good,
    borderRadius: radius.sm,
  },
  saveSmallBtnText: {
    fontSize: fontSize.xs,
    color: '#0D1117',
    fontWeight: '700',
  },
  cancelBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  cancelBtnText: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  dateError: {
    fontSize: fontSize.xs,
    color: colors.critical,
    marginTop: spacing.xs,
  },

  // Growth stage
  stageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  arrowBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  arrowBtnDisabled: {
    opacity: 0.3,
  },
  arrowBtnText: {
    fontSize: 22,
    color: colors.text,
    lineHeight: 26,
  },
  stageCenter: {
    flex: 1,
    alignItems: 'center',
  },
  stageName: {
    fontSize: fontSize.lg,
    color: colors.text,
    fontWeight: '600',
  },
  stageCounter: {
    fontSize: fontSize.xs,
    color: colors.textFaint,
    marginTop: 2,
  },

  // Milestone
  milestoneCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  milestoneTitle: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  progressTrack: {
    height: 8,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.full,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.good,
    borderRadius: radius.full,
  },
  progressPercent: {
    fontSize: fontSize.xs,
    color: colors.textFaint,
    textAlign: 'right',
    marginBottom: spacing.sm,
  },
  milestoneDays: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  milestoneReached: {
    fontSize: fontSize.md,
    color: colors.good,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  stressWarning: {
    fontSize: fontSize.sm,
    color: colors.caution,
    marginBottom: spacing.xs,
  },
  estimatedDate: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
  },

  // Tips
  tipsRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  tipCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  tipIcon: {
    fontSize: 20,
    marginBottom: spacing.xs,
  },
  tipTitle: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  tipBody: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    lineHeight: 17,
  },

  // Remove
  removeBtn: {
    alignItems: 'center',
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
  },
  removeBtnText: {
    fontSize: fontSize.sm,
    color: colors.critical,
  },
});
