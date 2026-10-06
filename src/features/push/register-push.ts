import { Platform } from "react-native";
import { api } from "@/lib/api";

let registrationStarted = false;

/**
 * Pede permissão e registra o Expo push token. Lead puro não chega aqui.
 * Sem projectId do EAS, ou se a pessoa negar, o app segue sem push.
 */
export async function registerPushToken(): Promise<void> {
  if (registrationStarted) return;
  if (Platform.OS !== "ios" && Platform.OS !== "android") return;
  registrationStarted = true;

  try {
    const Notifications = await import("expo-notifications");
    const Device = await import("expo-device");
    const Constants = await import("expo-constants");

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });

    if (!Device.isDevice) return;

    const current = await Notifications.getPermissionsAsync();
    let granted =
      current.granted ||
      current.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
    if (!granted) {
      const asked = await Notifications.requestPermissionsAsync();
      granted =
        asked.granted || asked.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
    }
    if (!granted) return;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "Padrão",
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    const projectId =
      Constants.default.expoConfig?.extra?.eas?.projectId ?? Constants.default.easConfig?.projectId;
    if (!projectId) return;

    const token = await Notifications.getExpoPushTokenAsync({ projectId });
    await api.pushToken({ token: token.data, platform: Platform.OS });
  } catch {
    // Push é best-effort. Permissão negada ou Expo Go sem token não trava o app.
  }
}
