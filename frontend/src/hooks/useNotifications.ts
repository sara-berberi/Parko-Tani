import { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { registerDeviceToken } from '../api/users';

export function useNotifications() {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!Device.isDevice) {
        setError('Must use physical device for push notifications');
        return;
      }
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        setError('Push notification permission denied');
        return;
      }
      const projId = Device.osInternalBuildId || undefined;
      const pushToken = await Notifications.getExpoPushTokenAsync({ projectId: projId });
      setToken(pushToken.data);
      await registerDeviceToken(pushToken.data, Device.osName || 'unknown');
    })();
  }, []);

  return { token, error };
}
