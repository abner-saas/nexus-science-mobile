import { useQuery } from "@tanstack/react-query";
import * as WebBrowser from "expo-web-browser";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { BrandHeader, Button, Card, ErrorText, Screen } from "@/components/ui";
import { api, ApiError } from "@/lib/api";
import { formatBrl } from "@/lib/format";
import { refreshSession } from "@/lib/session";
import { colors, space } from "@/theme";

function checkoutMessage(error: unknown): string {
  if (!(error instanceof ApiError)) return "Não foi possível abrir o pagamento.";
  if (error.status === 503) return "Pagamento indisponível no momento. Tente de novo mais tarde.";
  if (error.status === 404) return "Esse plano não está mais disponível.";
  if (error.status === 401) return "Sua sessão expirou. Entre de novo.";
  return error.message || "Não foi possível abrir o pagamento.";
}

export function CheckoutScreen() {
  const { planId } = useLocalSearchParams<{ planId?: string }>();
  const plans = useQuery({ queryKey: ["plans"], queryFn: () => api.plans() });
  const plan = plans.data?.data.find((row) => row.id === planId);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function pay() {
    if (!planId) return;
    setError(null);
    setLoading(true);
    try {
      const { data } = await api.checkout(planId);
      await WebBrowser.openBrowserAsync(data.checkoutUrl);
      await refreshSession();
      router.replace("/");
    } catch (err) {
      setError(checkoutMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <BrandHeader subtitle="Pagamento" />
      <View style={styles.body}>
        <Card>
          <Text style={styles.title}>{plan?.name ?? "Plano"}</Text>
          <Text style={styles.price}>{plan ? formatBrl(plan.value) : ""}</Text>
          <Text style={styles.copy}>
            A fatura abre no navegador. PIX, boleto ou cartão ficam na página do Asaas. Nenhuma chave
            de pagamento fica neste app.
          </Text>
          <ErrorText text={error} />
          <Button label="Abrir fatura" onPress={pay} loading={loading} disabled={!planId} />
          <Button label="Voltar" onPress={() => router.back()} variant="ghost" />
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: space.lg },
  title: { color: colors.navy, fontSize: 22, fontWeight: "700" },
  price: { color: colors.ink, fontSize: 18, marginVertical: space.sm },
  copy: { color: colors.muted, fontSize: 14, marginBottom: space.md },
});
