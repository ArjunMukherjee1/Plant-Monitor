import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    async function register() {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('plant-alerts', {
          name: 'Plant Alerts',
          importance: Notifications.AndroidImportance.MAX,
          sound: 'default',
        });
      }

      const { status } = await Notifications.requestPermissionsAsync();
      setPermissionGranted(status === 'granted');
      if (status !== 'granted') return;

      try {
        const token = await Notifications.getExpoPushTokenAsync();
        setExpoPushToken(token.data);
      } catch {
        // Expo Go doesn't support push tokens without an EAS project — ignore
      }
    }
    register();
  }, []);

  return { expoPushToken, permissionGranted };
}
