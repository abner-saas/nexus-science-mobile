import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import { Linking, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { PlanPlate } from "@/components/plan-plate";
import { BrandHeader, Button, Card, ErrorText, Screen } from "@/components/ui";
import { api, ApiError } from "@/lib/api";
import { planMaterial } from "@/lib/plan-material";
import { refreshSession } from "@/lib/session";
import { colors, font, space } from "@/theme";

function checkoutMessage(error: unknown): string {
  if (!(error instanceof ApiError)) return "Não foi possível abrir o pagamento.";
  if (error.status === 503) {
    return error.message || "Pagamento indisponível no momento. Tente de novo mais tarde.";
  }
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
      if (Platform.OS === "web") {
        const open = (
          globalThis as {
            open?: (url: string, target?: string, features?: string) => object | null;
          }
        ).open;
        const opened = open?.(data.checkoutUrl, "_blank", "noopener,noreferrer");
        if (!opened) await Linking.openURL(data.checkoutUrl);
      } else {
        await WebBrowser.openBrowserAsync(data.checkoutUrl);
      }
      await refreshSession();
      router.replace("/");
    } catch (err) {
      setError(checkoutMessage(err));
    } finally {
      setLoading(false);
    }
  }

  const material = plan ? planMaterial(plan.tier, plan.name) : "paper";

  return (
    <Screen tone="navy">
      <BrandHeader title="Pagamento" />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.body}>
        {plan ? (
          <PlanPlate plan={plan} />
        ) : (
          <Text style={styles.copy}>{plans.isLoading ? "Carregando o plano" : "Plano"}</Text>
        )}
        <Card style={styles.actions}>
          <Text style={styles.copy}>
            A fatura abre no navegador. PIX, boleto ou cartão ficam na página do Asaas. Nenhuma chave de
            pagamento fica neste app.
          </Text>
          <ErrorText text={error} />
          <Button
            label="Abrir fatura"
            onPress={pay}
            loading={loading}
            disabled={!planId}
            variant={material === "gold" ? "plate" : "primary"}
          />
          <Button label="Voltar" onPress={() => router.back()} variant="ghost" />
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  body: { padding: space.lg, gap: space.md },
  actions: { gap: space.md },
  copy: { fontFamily: font.body, color: colors.muted, fontSize: 14, lineHeight: 21 },
});
