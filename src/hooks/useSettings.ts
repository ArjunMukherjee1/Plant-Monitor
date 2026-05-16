import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useState } from 'react';
import { AppSettings } from '../api/types';

const SETTINGS_KEY = 'plant_app_settings';
const TOKEN_KEY = 'ha_token';

export const DEFAULT_SETTINGS: AppSettings = {
  haUrl: '',
  haToken: '',
  moistureEntityId: '',
  temperatureEntityId: '',
  lightEntityId: '',
  optimalMoistureMin: 40,
  optimalMoistureMax: 80,
  optimalTempMin: 60,
  optimalTempMax: 80,
  notificationThreshold: 25,
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
        setSettingsState({ ...DEFAULT_SETTINGS, ...parsed, haToken: token ?? '' });
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
