import "react-native-reanimated";
import { BebasNeue_400Regular } from "@expo-google-fonts/bebas-neue";
import { DMSans_400Regular, DMSans_500Medium, DMSans_700Bold } from "@expo-google-fonts/dm-sans";
import { Montserrat_600SemiBold, Montserrat_700Bold } from "@expo-google-fonts/montserrat";
import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { registerPushToken } from "@/features/push/register-push";
import { queryClient } from "@/lib/queryClient";
import { refreshSession } from "@/lib/session";
import { useAuthStore } from "@/store/auth";
import { colors } from "@/theme";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const session = useAuthStore((state) => state.session);
  const [sessionReady, setSessionReady] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    BebasNeue_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  useEffect(() => {
    refreshSession().finally(() => setSessionReady(true));
  }, []);

  useEffect(() => {
    if ((fontsLoaded || fontError) && sessionReady) {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [fontError, fontsLoaded, sessionReady]);

  useEffect(() => {
    if (session.status === "member") {
      void registerPushToken();
    }
  }, [session]);

  if ((!fontsLoaded && !fontError) || !sessionReady) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <QueryClientProvider client={queryClient}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: colors.navy },
            animation: "fade",
          }}
        />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
