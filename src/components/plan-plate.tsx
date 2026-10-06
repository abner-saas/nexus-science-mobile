import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { Plan } from "@/lib/api";
import { formatBrl } from "@/lib/format";
import { planMaterial, type PlanMaterial } from "@/lib/plan-material";
import { colors, font, radius, shadow, space } from "@/theme";

const PLATE: Record<
  PlanMaterial,
  { ground: string; ink: string; price: string; edge: string; priceSize: number; pad: number }
> = {
  gold: { ground: colors.navy, ink: colors.white, price: colors.white, edge: colors.maroon, priceSize: 56, pad: 22 },
  silver: { ground: colors.white, ink: colors.navy, price: colors.navy, edge: colors.navy, priceSize: 46, pad: 18 },
  bronze: { ground: colors.white, ink: colors.ink, price: colors.navy, edge: colors.maroon, priceSize: 40, pad: 16 },
  paper: { ground: colors.white, ink: colors.ink, price: colors.navy, edge: colors.line, priceSize: 34, pad: 16 },
};

export function PlanPlate({ plan, children }: { plan: Plan; children?: ReactNode }) {
  const material = planMaterial(plan.tier, plan.name);
  const plate = PLATE[material];
  const sameName = plan.name.trim().toLowerCase() === plan.tier.trim().toLowerCase();
  const benefits = plan.benefits ?? [];

  return (
    <View
      style={[
        styles.plate,
        {
          backgroundColor: plate.ground,
          padding: plate.pad,
          borderWidth: 1,
          borderTopWidth: material === "gold" || material === "bronze" ? 4 : 1,
          borderColor: plate.edge,
        },
      ]}
    >
      <Text style={[styles.tier, { color: plate.ink, fontSize: material === "gold" ? 40 : 28 }]}>{plan.tier}</Text>
      {sameName ? null : <Text style={[styles.name, { color: plate.ink }]}>{plan.name}</Text>}
      <Text style={[styles.price, { color: plate.price, fontSize: plate.priceSize }]}>{formatBrl(plan.value)}</Text>
      {benefits.map((benefit) => (
        <View key={benefit} style={styles.benefitRow}>
          <View style={[styles.pip, { backgroundColor: plate.edge }]} />
          <Text style={[styles.benefit, { color: material === "gold" ? colors.white : colors.ink }]}>{benefit}</Text>
        </View>
      ))}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  plate: { gap: 6, borderRadius: radius.card, ...shadow.card },
  tier: { fontFamily: font.display, lineHeight: 42 },
  name: { fontFamily: font.titleSoft, fontSize: 16 },
  price: { fontFamily: font.display, lineHeight: 58, marginTop: 2 },
  benefitRow: { flexDirection: "row", alignItems: "center", gap: space.sm },
  pip: { width: 6, height: 6, borderRadius: radius.pill },
  benefit: { fontFamily: font.body, fontSize: 14, flex: 1 },
});
