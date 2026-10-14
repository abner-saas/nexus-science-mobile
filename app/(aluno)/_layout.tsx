"use no memo";

import { Redirect, Tabs } from "expo-router";
import { useReducedMotion } from "react-native-reanimated";
import { View } from "react-native";
import { TabMotion } from "@/components/motion";
import { StudioTabBar } from "@/components/studio-tab-bar";
import { BrandHeader, Button, Screen } from "@/components/ui";
import { signOutToLogin } from "@/lib/sign-out";
import { useAuthStore } from "@/store/auth";
import { colors } from "@/theme";

export default function AlunoLayout() {
  const reduced = useReducedMotion();
  const session = useAuthStore((state) => state.session);
  if (session.status === "loading") return null;
  if (session.status !== "member" || session.user.role !== "STUDENT" || !session.user.studentId) {
    return <Redirect href="/" />;
  }

  return (
    <Screen tone="navy">
      <BrandHeader
        title={session.user.name}
        action={<Button label="Sair" onPress={signOutToLogin} variant="ghost" onDark />}
      />
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <Tabs
          tabBar={(props) => (
            <StudioTabBar
              state={props.state}
              descriptors={props.descriptors}
              navigation={props.navigation}
              insets={props.insets}
            />
          )}
          screenLayout={({ children }) => <TabMotion>{children}</TabMotion>}
          screenOptions={{
            headerShown: false,
            animation: reduced ? "none" : "shift",
            transitionSpec: { animation: "timing", config: { duration: 280 } },
            sceneStyle: { backgroundColor: colors.background },
          }}
        >
          <Tabs.Screen name="treino" options={{ title: "Treino" }} />
          <Tabs.Screen name="bio" options={{ title: "Bio" }} />
          <Tabs.Screen name="pagamentos" options={{ title: "Pagar" }} />
          <Tabs.Screen name="avaliacao" options={{ title: "Avaliação" }} />
        </Tabs>
      </View>
    </Screen>
  );
}
