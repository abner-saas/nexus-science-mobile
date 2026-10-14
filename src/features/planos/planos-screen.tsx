import { useQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import { Enter } from "@/components/motion";
import { PlanPlate } from "@/components/plan-plate";
import { BrandHeader, Button, Empty, Screen } from "@/components/ui";
import { api, ApiError } from "@/lib/api";
import { comparePlans, planMaterial } from "@/lib/plan-material";
import { signOutToLogin } from "@/lib/sign-out";
import { colors, space } from "@/theme";

export function PlanosScreen() {
  const plans = useQuery({ queryKey: ["plans"], queryFn: () => api.plans() });
  const rows = [...(plans.data?.data ?? [])].sort(comparePlans);

  return (
    <Screen tone="navy">
      <BrandHeader title="Planos" action={<Button label="Sair" onPress={signOutToLogin} variant="ghost" onDark />} />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.list}>
        {plans.isError ? (
          <Empty text={plans.error instanceof ApiError ? plans.error.message : "Não foi possível carregar os planos."} />
        ) : null}
        {plans.isSuccess && rows.length === 0 ? <Empty text="Nenhum plano disponível agora." /> : null}
        {rows.map((plan, index) => (
          <Enter key={plan.id} index={index}>
            <PlanPlate plan={plan}>
              <View style={styles.action}>
                <Button
                  label="Continuar"
                  variant={planMaterial(plan.tier, plan.name) === "gold" ? "plate" : "primary"}
                  onPress={() => router.push({ pathname: "/(onboarding)/checkout", params: { planId: plan.id } })}
                />
              </View>
            </PlanPlate>
          </Enter>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  list: { padding: space.lg, gap: space.md, paddingBottom: space.xl },
  action: { marginTop: space.sm },
});
