import { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { registerDeviceToken } from "../api/users";

export function useNotifications() {
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (Constants.appOwnership === "expo") {
        setError(
          "Push notifications require a development build (Expo Go not supported)",
        );
        return;
      }
      if (!Device.isDevice) {
        setError("Must use physical device for push notifications");
        return;
      }
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        setError("Push notification permission denied");
        return;
      }
      try {
        const projectId = Constants?.expoConfig?.extra?.eas?.projectId;
        const pushToken = await Notifications.getExpoPushTokenAsync(
          projectId ? { projectId } : undefined,
        );
        setToken(pushToken.data);
        await registerDeviceToken(pushToken.data, Device.osName || "unknown");
      } catch (e: any) {
        setError(e?.message || "Failed to get push token");
      }
    })();
  }, []);

  return { token, error };
}
