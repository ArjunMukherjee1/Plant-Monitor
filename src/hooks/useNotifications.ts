import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
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

      const token = await Notifications.getExpoPushTokenAsync();
      setExpoPushToken(token.data);
    }
    register();
  }, []);

  return { expoPushToken, permissionGranted };
}
