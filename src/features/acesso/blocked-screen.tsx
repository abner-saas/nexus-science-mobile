import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/ui";
import type { BillingView } from "@/store/auth";
import { useAuthStore } from "@/store/auth";
import { colors, font, space } from "@/theme";

const COPY: Record<NonNullable<BillingView["reason"]>, string> = {
  overdue:
    "O acesso ao treino, ao biofeedback e à avaliação fecha no 7º dia de atraso. O pagamento libera de novo.",
  paused: "Sua consultoria está pausada. Fale com a equipe para retomar.",
  cancelled: "Sua consultoria foi encerrada. Fale com a equipe se quiser voltar.",
  pending: "O plano ainda não foi confirmado. Conclua o pagamento para liberar o app.",
};

export function useStudentAccess() {
  const session = useAuthStore((state) => state.session);
  if (session.status !== "member" || !session.user.studentId) return { kind: "missing" as const };
  if (session.user.billing?.blocked) {
    return { kind: "blocked" as const, billing: session.user.billing };
  }
  return { kind: "open" as const, studentId: session.user.studentId };
}

export function BlockedConsult({ billing }: { billing: BillingView }) {
  const router = useRouter();
  const text = (billing.reason && COPY[billing.reason]) || "O acesso ao app está bloqueado. Fale com a equipe.";
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Acesso pausado</Text>
      <Text style={styles.copy}>{text}</Text>
      {billing.reason === "overdue" || billing.reason === "pending" ? (
        <Button label="Ir para pagamento" onPress={() => router.push("/(aluno)/pagamentos")} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: colors.background, padding: space.lg, gap: space.md },
  title: { fontFamily: font.title, fontSize: 22, color: colors.ink },
  copy: { fontFamily: font.body, fontSize: 15, lineHeight: 22, color: colors.muted },
});
