import { Redirect } from "expo-router";
import { Text, View } from "react-native";
import { useAuthStore } from "@/store/auth";
import { colors } from "@/theme";

export default function Index() {
  const session = useAuthStore((state) => state.session);

  if (session.status === "loading") {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.background }}>
        <Text style={{ color: colors.muted }}>Carregando...</Text>
      </View>
    );
  }

  if (session.status === "guest") return <Redirect href="/(auth)/login" />;
  if (session.status === "lead") return <Redirect href="/(onboarding)/planos" />;
  if (session.status === "member" && session.user.role === "STUDENT" && session.user.studentId) {
    return <Redirect href="/(aluno)/treino" />;
  }
  if (session.status === "member" && session.user.role === "STUDENT") {
    return <Redirect href="/sem-vinculo" />;
  }
  return <Redirect href="/equipe" />;
}
