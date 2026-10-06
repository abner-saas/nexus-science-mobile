import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import { ConfirmButton } from "@/components/confirm-button";
import { MetricBars, type Meter } from "@/components/metric-bars";
import { Button, Card } from "@/components/ui";
import { api } from "@/lib/api";
import { formatDateBr, todayInRecife } from "@/lib/format";
import { colors, font, radius, space } from "@/theme";

const FIELDS = [
  {
    key: "energy",
    label: "Energia",
    shortLabel: "Ener.",
    prompt: "Como está sua energia agora?",
    lowLabel: "pouca",
    highLabel: "muita",
    icon: "flash-outline",
    tone: "capacity",
  },
  {
    key: "mood",
    label: "Humor",
    shortLabel: "Humor",
    prompt: "Como está seu humor hoje?",
    lowLabel: "baixo",
    highLabel: "alto",
    icon: "happy-outline",
    tone: "capacity",
  },
  {
    key: "stress",
    label: "Estresse",
    shortLabel: "Estr.",
    prompt: "Quanto estresse você percebe?",
    lowLabel: "pouco",
    highLabel: "muito",
    icon: "pulse-outline",
    tone: "load",
  },
  {
    key: "sleep",
    label: "Sono",
    shortLabel: "Sono",
    prompt: "Como foi a qualidade do seu sono?",
    lowLabel: "baixa",
    highLabel: "alta",
    icon: "moon-outline",
    tone: "capacity",
  },
  {
    key: "musclePain",
    label: "Dor muscular",
    shortLabel: "Dor",
    prompt: "Quanta dor muscular você percebe?",
    lowLabel: "nenhuma",
    highLabel: "intensa",
    icon: "body-outline",
    tone: "load",
  },
] as const;

type BioKey = (typeof FIELDS)[number]["key"];
type BioForm = Record<BioKey, number>;

const initial: BioForm = {
  energy: 7,
  mood: 7,
  stress: 4,
  sleep: 7,
  musclePain: 3,
};

export function BioScreen({ studentId }: { studentId: string }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<BioForm>(initial);
  const [pulse, setPulse] = useState(0);
  const history = useQuery({
    queryKey: ["bio", studentId],
    queryFn: () => api.biofeedback.list(studentId),
  });
  const save = useMutation({
    mutationFn: () =>
      api.biofeedback.create({
        studentId,
        date: todayInRecife(),
        energy: form.energy,
        mood: form.mood,
        stress: form.stress,
        sleep: form.sleep,
        musclePain: form.musclePain,
      }),
    onSuccess: () => {
      setPulse((current) => current + 1);
      void queryClient.invalidateQueries({ queryKey: ["bio", studentId] });
    },
  });

  const meters: Meter[] = FIELDS.map((field) => ({
    ...field,
    value: form[field.key],
  }));
  const rows = history.data?.data ?? [];

  return (
    <ScrollView contentContainerStyle={styles.list} style={styles.scroll}>
      <Card style={styles.sheet}>
        <View style={styles.sectionHead}>
          <View style={styles.sectionCopy}>
            <Text style={styles.title}>Como você está hoje?</Text>
            <Text style={styles.date}>{formatDateBr(todayInRecife())}</Text>
          </View>
          <View style={styles.scaleBadge}>
            <Text style={styles.scaleBadgeText}>1–10</Text>
          </View>
        </View>
        <Text style={styles.hint}>
          Toque em uma nota para cada percepção. O app registra suas respostas sem classificá-las
          como boas ou ruins.
        </Text>
        <MetricBars
          meters={meters}
          onChange={(key, value) => {
            save.reset();
            setForm((current) => ({ ...current, [key]: value }));
          }}
        />
        <ConfirmButton
          label="Registrar biofeedback"
          confirmedLabel="Biofeedback registrado"
          confirmed={save.isSuccess}
          pulse={pulse}
          loading={save.isPending}
          onPress={() => save.mutate()}
        />
        {save.isError ? (
          <Text style={styles.error}>Não foi possível salvar agora. Confira a conexão e tente novamente.</Text>
        ) : null}
      </Card>
      <Card style={styles.sheet}>
        <View style={styles.sectionHead}>
          <View style={styles.sectionCopy}>
            <Text style={styles.title}>Histórico</Text>
            <Text style={styles.date}>Últimos 14 dias</Text>
          </View>
        </View>
        {history.isLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator color={colors.navy} />
            <Text style={styles.hint}>Carregando registros</Text>
          </View>
        ) : null}
        {history.isError ? (
          <View style={styles.state}>
            <Text style={styles.hint}>Não foi possível carregar o histórico.</Text>
            <Button label="Tentar novamente" variant="ghost" onPress={() => void history.refetch()} />
          </View>
        ) : null}
        {history.isSuccess && rows.length === 0 ? (
          <Text style={styles.hint}>O registro de hoje começa esta lista.</Text>
        ) : null}
        {rows.map((row) => (
          <View key={row.id} style={styles.historyRow}>
            <Text style={styles.date}>{formatDateBr(row.date)}</Text>
            <View style={styles.historyMetrics}>
              {FIELDS.map((field) => {
                const value = row[field.key];
                const color = field.tone === "load" ? colors.maroon : colors.navy;
                return (
                  <View key={field.key} style={styles.historyMetric}>
                    <Text numberOfLines={1} style={styles.metricLabel}>{field.shortLabel}</Text>
                    <Text style={[styles.metricValue, { color }]}>
                      {value == null ? "—" : `${value}/10`}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  list: { padding: space.lg, gap: space.md, paddingBottom: space.xl },
  sheet: { gap: space.md, padding: space.sm },
  sectionHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: space.md,
  },
  sectionCopy: { flex: 1, gap: 2 },
  title: { fontFamily: font.title, fontSize: 19, color: colors.ink },
  date: { fontFamily: font.bodyMedium, color: colors.muted, fontSize: 13 },
  scaleBadge: {
    borderRadius: radius.pill,
    backgroundColor: "rgba(0,32,96,0.07)",
    paddingHorizontal: space.md,
    paddingVertical: 6,
  },
  scaleBadgeText: { fontFamily: font.bodyBold, color: colors.navy, fontSize: 13 },
  hint: { fontFamily: font.body, fontSize: 14, color: colors.muted, lineHeight: 20 },
  error: {
    borderRadius: radius.input,
    backgroundColor: "rgba(220,38,38,0.08)",
    padding: space.md,
    fontFamily: font.body,
    color: colors.danger,
    lineHeight: 20,
  },
  loading: { flexDirection: "row", alignItems: "center", gap: space.sm, paddingVertical: space.sm },
  state: { gap: space.sm },
  historyRow: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: space.md,
    gap: space.sm,
  },
  historyMetrics: { flexDirection: "row", gap: 4 },
  historyMetric: {
    flex: 1,
    minWidth: 0,
    borderRadius: radius.input,
    backgroundColor: colors.input,
    paddingHorizontal: 4,
    paddingVertical: 6,
    gap: 2,
  },
  metricLabel: { fontFamily: font.body, color: colors.muted, fontSize: 9 },
  metricValue: { fontFamily: font.bodyBold, fontSize: 12 },
});
