import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { registerPushToken } from "@/features/push/register-push";
import { queryClient } from "@/lib/queryClient";
import { refreshSession } from "@/lib/session";
import { useAuthStore } from "@/store/auth";
import { colors } from "@/theme";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const session = useAuthStore((state) => state.session);

  useEffect(() => {
    refreshSession().finally(() => {
      SplashScreen.hideAsync().catch(() => undefined);
    });
  }, []);

  useEffect(() => {
    if (session.status === "member") {
      void registerPushToken();
    }
  }, [session]);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.background },
          }}
        />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
