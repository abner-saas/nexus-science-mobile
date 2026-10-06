import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { View } from "react-native";
import { BrandHeader, Button, Screen } from "@/components/ui";
import { signOutToLogin } from "@/lib/sign-out";
import { useAuthStore } from "@/store/auth";
import { colors } from "@/theme";

export default function AlunoLayout() {
  const session = useAuthStore((state) => state.session);
  if (session.status === "loading") return null;
  if (session.status !== "member" || session.user.role !== "STUDENT" || !session.user.studentId) {
    return <Redirect href="/" />;
  }

  return (
    <Screen>
      <BrandHeader
        subtitle={`Olá, ${session.user.name}`}
        action={<Button label="Sair" onPress={signOutToLogin} variant="ghost" />}
      />
      <View style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: colors.navy,
            tabBarInactiveTintColor: colors.muted,
            tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.line },
          }}
        >
          <Tabs.Screen
            name="treino"
            options={{
              title: "Treino",
              tabBarIcon: ({ color, size }) => <Ionicons name="barbell-outline" color={color} size={size} />,
            }}
          />
          <Tabs.Screen
            name="bio"
            options={{
              title: "Bio",
              tabBarIcon: ({ color, size }) => <Ionicons name="heart-outline" color={color} size={size} />,
            }}
          />
          <Tabs.Screen
            name="pagamentos"
            options={{
              title: "Pagar",
              tabBarIcon: ({ color, size }) => <Ionicons name="wallet-outline" color={color} size={size} />,
            }}
          />
          <Tabs.Screen
            name="avaliacao"
            options={{
              title: "Avaliação",
              tabBarIcon: ({ color, size }) => <Ionicons name="body-outline" color={color} size={size} />,
            }}
          />
        </Tabs>
      </View>
    </Screen>
  );
}
