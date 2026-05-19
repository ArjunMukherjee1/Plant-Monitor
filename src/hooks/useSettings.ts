import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useState } from 'react';
import { AppSettings } from '../api/types';

const SETTINGS_KEY = 'plant_app_settings';
const TOKEN_KEY = 'ha_token';

export const DEFAULT_SETTINGS: AppSettings = {
  haUrl: 'http://10.220.80.243:8123',
  haToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIyZTUwYzFjZDZhZWE0MzhhOWQwZTY1ODBmYTFjMDAzOSIsImlhdCI6MTc3OTA2NDEwOCwiZXhwIjoyMDk0NDI0MTA4fQ._p7MPhuG7RarmrBOlc96xEloc8AYPNZWBtg_7Pdeo7s',
  moistureEntityId: 'sensor.third_reality_inc_3rsm0147z_soil_moisture',
  temperatureEntityId: 'sensor.third_reality_inc_3rsm0147z_temperature',
  lightEntityId: '',
  optimalMoistureMin: 40,
  optimalMoistureMax: 80,
  optimalTempMin: 60,
  optimalTempMax: 80,
  notificationThreshold: 25,
  plantTypeId: '',
  plantingDate: '',
  currentStageIndex: 0,
};

export function useSettings() {
  const [settings, setSettingsState] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [stored, token] = await Promise.all([
          AsyncStorage.getItem(SETTINGS_KEY),
          SecureStore.getItemAsync(TOKEN_KEY),
        ]);
        const parsed: Partial<AppSettings> = stored ? JSON.parse(stored) : {};
        // Only let stored values override defaults when they're actually set
        const merged = { ...DEFAULT_SETTINGS };
        for (const key of Object.keys(parsed) as (keyof AppSettings)[]) {
          const val = parsed[key];
          if (val !== '' && val !== null && val !== undefined) {
            (merged as Record<string, unknown>)[key] = val;
          }
        }
        merged.haToken = (token || '') !== '' ? token! : DEFAULT_SETTINGS.haToken;
        setSettingsState(merged);
      } catch {
        // fall through to defaults
      } finally {
        setLoaded(true);
      }
    }
    load();
  }, []);

  const saveSettings = useCallback(
    async (updates: Partial<AppSettings>) => {
      const next = { ...settings, ...updates };
      const { haToken, ...rest } = next;
      await Promise.all([
        AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(rest)),
        haToken ? SecureStore.setItemAsync(TOKEN_KEY, haToken) : Promise.resolve(),
      ]);
      setSettingsState(next);
    },
    [settings]
  );

  return { settings, saveSettings, loaded };
}
