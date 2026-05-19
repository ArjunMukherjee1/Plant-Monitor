import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
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

interface Props {
  settings: AppSettings;
  onSave: (updates: Partial<AppSettings>) => Promise<void>;
  expoPushToken: string | null;
}

export function SettingsScreen({ settings, onSave, expoPushToken }: Props) {
  const [form, setForm] = useState<AppSettings>(settings);
  const [saved, setSaved] = useState(false);
  const [plantPickerVisible, setPlantPickerVisible] = useState(false);

  const currentPlant: Plant | undefined = form.plantTypeId
    ? getPlantById(form.plantTypeId)
    : undefined;

  const update = (key: keyof AppSettings, val: string | number) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  function handlePlantSelected(plant: Plant) {
    setPlantPickerVisible(false);
    setForm((prev) => ({
      ...prev,
      plantTypeId: plant.id,
      optimalMoistureMin: plant.optimalMoistureMin,
      optimalMoistureMax: plant.optimalMoistureMax,
      optimalTempMin: plant.optimalTempMin,
      optimalTempMax: plant.optimalTempMax,
    }));
  }

  const handleSave = async () => {
    await onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.section}>Home Assistant</Text>

        <Field label="HA URL">
          <TextInput
            style={styles.input}
            value={form.haUrl}
            onChangeText={(v) => update('haUrl', v)}
            placeholder="http://homeassistant.local:8123"
            placeholderTextColor={colors.textFaint}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </Field>

        <Field label="Long-Lived Access Token">
          <TextInput
            style={styles.input}
            value={form.haToken}
            onChangeText={(v) => update('haToken', v)}
            placeholder="eyJ0eXAiOiJKV1Q..."
            placeholderTextColor={colors.textFaint}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
        </Field>

        <Text style={styles.section}>Entity IDs</Text>

        <Field label="Moisture Entity">
          <TextInput
            style={styles.input}
            value={form.moistureEntityId}
            onChangeText={(v) => update('moistureEntityId', v)}
            placeholder="sensor.soil_moisture"
            placeholderTextColor={colors.textFaint}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </Field>

        <Field label="Temperature Entity">
          <TextInput
            style={styles.input}
            value={form.temperatureEntityId}
            onChangeText={(v) => update('temperatureEntityId', v)}
            placeholder="sensor.soil_temperature"
            placeholderTextColor={colors.textFaint}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </Field>

        <Text style={styles.section}>Plant Type</Text>

        <TouchableOpacity
          style={styles.plantTypeRow}
          onPress={() => setPlantPickerVisible(true)}
        >
          <View style={styles.plantTypeLeft}>
            <Text style={styles.plantTypeLabel}>Plant type</Text>
            <Text style={styles.plantTypeValue}>
              {currentPlant ? currentPlant.name : 'Not set'}
            </Text>
          </View>
          <Text style={styles.plantTypeArrow}>›</Text>
        </TouchableOpacity>

        <Text style={styles.section}>Optimal Ranges</Text>

        <View style={styles.row}>
          <Field label="Moisture Min %" style={{ flex: 1 }}>
            <TextInput
              style={styles.input}
              value={String(form.optimalMoistureMin)}
              onChangeText={(v) => update('optimalMoistureMin', parseFloat(v) || 0)}
              keyboardType="numeric"
            />
          </Field>
          <View style={{ width: spacing.sm }} />
          <Field label="Moisture Max %" style={{ flex: 1 }}>
            <TextInput
              style={styles.input}
              value={String(form.optimalMoistureMax)}
              onChangeText={(v) => update('optimalMoistureMax', parseFloat(v) || 0)}
              keyboardType="numeric"
            />
          </Field>
        </View>

        <View style={styles.row}>
          <Field label="Temp Min °F" style={{ flex: 1 }}>
            <TextInput
              style={styles.input}
              value={String(form.optimalTempMin)}
              onChangeText={(v) => update('optimalTempMin', parseFloat(v) || 0)}
              keyboardType="numeric"
            />
          </Field>
          <View style={{ width: spacing.sm }} />
          <Field label="Temp Max °F" style={{ flex: 1 }}>
            <TextInput
              style={styles.input}
              value={String(form.optimalTempMax)}
              onChangeText={(v) => update('optimalTempMax', parseFloat(v) || 0)}
              keyboardType="numeric"
            />
          </Field>
        </View>

        <Field label="Alert Threshold — Water Now at % moisture">
          <TextInput
            style={styles.input}
            value={String(form.notificationThreshold)}
            onChangeText={(v) => update('notificationThreshold', parseFloat(v) || 0)}
            keyboardType="numeric"
          />
        </Field>

        <Text style={styles.section}>Notifications</Text>

        <View style={styles.tokenBox}>
          <Text style={styles.tokenLabel}>Expo Push Token</Text>
          <Text style={styles.tokenValue} selectable>
            {expoPushToken ?? 'Requesting permission…'}
          </Text>
          {expoPushToken && (
            <Text style={styles.tokenHint}>
              Store this in a Home Assistant input_text helper and use it in an automation
              to call the Expo push API when moisture falls below your threshold.
            </Text>
          )}
        </View>

        <Text style={[styles.section, { opacity: 0.4 }]}>Irrigation — Coming Soon</Text>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>{saved ? 'Saved ✓' : 'Save Settings'}</Text>
        </TouchableOpacity>
      </ScrollView>

      <PlantPicker
        visible={plantPickerVisible}
        onSelect={handlePlantSelected}
        onClose={() => setPlantPickerVisible(false)}
      />
    </KeyboardAvoidingView>
  );
}

function Field({
  label,
  children,
  style,
}: {
  label: string;
  children: React.ReactNode;
  style?: object;
}) {
  return (
    <View style={[{ marginBottom: spacing.md }, style]}>
      <Text style={fieldStyles.label}>{label}</Text>
      {children}
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  label: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    padding: spacing.lg,
    paddingBottom: 60,
  },
  section: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    color: colors.text,
    fontSize: fontSize.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
  },
  tokenBox: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  tokenLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  tokenValue: {
    fontSize: fontSize.sm,
    color: colors.moisture,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  tokenHint: {
    fontSize: fontSize.xs,
    color: colors.textFaint,
    marginTop: spacing.sm,
    lineHeight: 16,
  },
  saveBtn: {
    backgroundColor: colors.good,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  saveBtnText: {
    color: '#0D1117',
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  plantTypeRow: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  plantTypeLeft: {
    flex: 1,
  },
  plantTypeLabel: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  plantTypeValue: {
    fontSize: fontSize.md,
    color: colors.text,
  },
  plantTypeArrow: {
    fontSize: fontSize.xl,
    color: colors.textFaint,
    marginLeft: spacing.sm,
  },
});
