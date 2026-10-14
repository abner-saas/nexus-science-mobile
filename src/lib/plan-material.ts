export type PlanMaterial = "bronze" | "silver" | "gold" | "paper";

const RANK: Record<PlanMaterial, number> = {
  gold: 0,
  silver: 1,
  bronze: 2,
  paper: 3,
};

export function planMaterial(tier: string, name: string): PlanMaterial {
  const text = `${tier} ${name}`
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
  if (text.includes("gold") || text.includes("ouro")) return "gold";
  if (text.includes("silver") || text.includes("prata")) return "silver";
  if (text.includes("bronze")) return "bronze";
  return "paper";
}

export function comparePlans(a: { tier: string; name: string }, b: { tier: string; name: string }): number {
  return RANK[planMaterial(a.tier, a.name)] - RANK[planMaterial(b.tier, b.name)];
}
