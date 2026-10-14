import { Redirect } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useAuthStore } from "@/store/auth";
import { colors, font } from "@/theme";

export default function Index() {
  const session = useAuthStore((state) => state.session);

  if (session.status === "loading") {
    return (
      <View style={styles.boot}>
        <Text style={styles.mark}>NEXUS</Text>
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

const styles = StyleSheet.create({
  boot: { flex: 1, backgroundColor: colors.navy, alignItems: "center", justifyContent: "center" },
  mark: { fontFamily: font.display, color: colors.white, fontSize: 56, lineHeight: 58 },
});
