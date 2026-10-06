import { useQuery } from "@tanstack/react-query";
import * as WebBrowser from "expo-web-browser";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/ui";
import { DueRuler } from "@/components/due-ruler";
import { api, type Payment } from "@/lib/api";
import { formatBrl, formatDateBr, paymentStatusLabel } from "@/lib/format";
import { colors, font, radius, shadow, space } from "@/theme";

function canPay(payment: Payment): boolean {
  if (!payment.checkoutUrl?.startsWith("https://")) return false;
  return payment.status === "PENDING" || payment.status === "OVERDUE";
}

export function PagamentosScreen({ studentId }: { studentId: string }) {
  const payments = useQuery({
    queryKey: ["payments", studentId],
    queryFn: () => api.payments(studentId),
  });
  const rows = payments.data?.data ?? [];

  return (
    <ScrollView contentContainerStyle={styles.list} style={styles.scroll}>
      {payments.isLoading ? <Text style={styles.meta}>Carregando cobranças</Text> : null}
      {payments.isSuccess && rows.length === 0 ? (
        <View style={styles.sheet}>
          <Text style={styles.title}>Cobrança</Text>
          <DueRuler />
          <Text style={styles.meta}>Nenhuma cobrança nesta régua.</Text>
        </View>
      ) : null}
      {rows.map((payment) => (
        <View key={payment.id} style={styles.sheet}>
          <Text style={styles.meta}>Vence {formatDateBr(payment.dueDate)}</Text>
          <Text style={[styles.amount, payment.status === "OVERDUE" ? styles.late : null]}>
            {formatBrl(payment.amount)}
          </Text>
          <Text style={styles.status}>{paymentStatusLabel(payment.status)}</Text>
          <DueRuler dueDate={payment.dueDate} status={payment.status} />
          {canPay(payment) ? (
            <Button label="Pagar fatura" variant="maroon" onPress={() => WebBrowser.openBrowserAsync(payment.checkoutUrl!)} />
          ) : null}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  list: { padding: space.lg, gap: space.md, paddingBottom: space.xl },
  sheet: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.line,
    padding: space.lg,
    gap: space.sm,
    ...shadow.card,
  },
  title: { fontFamily: font.title, fontSize: 18, color: colors.ink },
  meta: { fontFamily: font.body, fontSize: 14, color: colors.muted },
  amount: { fontFamily: font.display, fontSize: 48, lineHeight: 50, color: colors.navy },
  late: { color: colors.maroon },
  status: {
    alignSelf: "flex-start",
    overflow: "hidden",
    borderRadius: radius.pill,
    backgroundColor: colors.input,
    paddingHorizontal: space.sm,
    paddingVertical: 4,
    fontFamily: font.bodyMedium,
    fontSize: 13,
    color: colors.ink,
  },
});
