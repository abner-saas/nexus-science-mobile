import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { BrandHeader, Button, Card, Empty, Screen } from "@/components/ui";
import { api, ApiError, type Plan } from "@/lib/api";
import { formatBrl } from "@/lib/format";
import { signOutToLogin } from "@/lib/sign-out";
import { colors, space } from "@/theme";

export function PlanosScreen() {
  const plans = useQuery({ queryKey: ["plans"], queryFn: () => api.plans() });
  const rows = plans.data?.data ?? [];

  return (
    <Screen>
      <BrandHeader subtitle="Escolha seu plano" action={<Button label="Sair" onPress={signOutToLogin} variant="ghost" />} />
      <ScrollView contentContainerStyle={styles.list}>
        {plans.isError ? (
          <Empty text={plans.error instanceof ApiError ? plans.error.message : "Não foi possível carregar os planos."} />
        ) : null}
        {plans.isSuccess && rows.length === 0 ? (
          <Empty text="Nenhum plano disponível no momento." />
        ) : null}
        {rows.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </ScrollView>
    </Screen>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  const benefits = plan.benefits ?? [];
  return (
    <Card>
      <Text style={styles.tier}>{plan.tier}</Text>
      <Text style={styles.name}>{plan.name}</Text>
      <Text style={styles.price}>{formatBrl(plan.value)}</Text>
      {benefits.map((benefit) => (
        <Text key={benefit} style={styles.benefit}>
          · {benefit}
        </Text>
      ))}
      <View style={styles.action}>
        <Button
          label="Continuar"
          onPress={() =>
            router.push({ pathname: "/(onboarding)/checkout", params: { planId: plan.id } })
          }
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  list: { padding: space.lg, gap: space.md },
  tier: { color: colors.maroon, fontSize: 12, fontWeight: "700", letterSpacing: 0.6 },
  name: { color: colors.navy, fontSize: 20, fontWeight: "700", marginTop: space.xs },
  price: { color: colors.ink, fontSize: 18, marginVertical: space.sm },
  benefit: { color: colors.muted, fontSize: 14 },
  action: { marginTop: space.md },
});
