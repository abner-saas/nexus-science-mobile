import { useQuery } from "@tanstack/react-query";
import * as WebBrowser from "expo-web-browser";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, Card, Empty } from "@/components/ui";
import { api, type Payment } from "@/lib/api";
import { formatBrl, paymentStatusLabel } from "@/lib/format";
import { colors, space } from "@/theme";

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
    <ScrollView contentContainerStyle={styles.list}>
      {payments.isSuccess && rows.length === 0 ? <Empty text="Nenhuma cobrança em aberto." /> : null}
      {rows.map((payment) => (
        <Card key={payment.id}>
          <View style={styles.row}>
            <Text style={styles.date}>{payment.dueDate}</Text>
            <Text style={styles.status}>{paymentStatusLabel(payment.status)}</Text>
          </View>
          <Text style={styles.amount}>{formatBrl(payment.amount)}</Text>
          {canPay(payment) ? (
            <Button
              label="Pagar fatura"
              variant="maroon"
              onPress={() => WebBrowser.openBrowserAsync(payment.checkoutUrl!)}
            />
          ) : null}
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  list: { padding: space.lg, gap: space.md },
  row: { flexDirection: "row", justifyContent: "space-between" },
  date: { color: colors.muted },
  status: { color: colors.navy, fontWeight: "700" },
  amount: { color: colors.ink, fontSize: 20, fontWeight: "700", marginVertical: space.sm },
});
