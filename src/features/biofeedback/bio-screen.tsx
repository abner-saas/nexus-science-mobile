import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, Card, Empty, Field } from "@/components/ui";
import { api } from "@/lib/api";
import { todayInRecife } from "@/lib/format";
import { colors, space } from "@/theme";

const FIELDS = [
  ["energy", "Energia"],
  ["mood", "Humor"],
  ["stress", "Estresse"],
  ["sleep", "Sono"],
  ["musclePain", "Dor"],
] as const;

type BioForm = Record<(typeof FIELDS)[number][0], string>;

const initial: BioForm = {
  energy: "7",
  mood: "7",
  stress: "4",
  sleep: "7",
  musclePain: "3",
};

export function BioScreen({ studentId }: { studentId: string }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<BioForm>(initial);
  const history = useQuery({
    queryKey: ["bio", studentId],
    queryFn: () => api.biofeedback.list(studentId),
  });
  const save = useMutation({
    mutationFn: () =>
      api.biofeedback.create({
        studentId,
        date: todayInRecife(),
        energy: Number(form.energy),
        mood: Number(form.mood),
        stress: Number(form.stress),
        sleep: Number(form.sleep),
        musclePain: Number(form.musclePain),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bio", studentId] }),
  });

  return (
    <ScrollView contentContainerStyle={styles.list}>
      {/* TODO: HealthKit / Health Connect (passos, FC, sono, peso) fica para a próxima leva. */}
      <Card>
        <Text style={styles.title}>Biofeedback de hoje</Text>
        <Text style={styles.hint}>Notas de 1 a 10.</Text>
        <View style={styles.grid}>
          {FIELDS.map(([key, label]) => (
            <View key={key} style={styles.cell}>
              <Field
                label={label}
                value={form[key]}
                onChangeText={(value) => setForm((current) => ({ ...current, [key]: value }))}
                keyboardType="number-pad"
              />
            </View>
          ))}
        </View>
        <Button
          label={save.isSuccess ? "Salvo" : "Registrar"}
          onPress={() => save.mutate()}
          loading={save.isPending}
        />
        {save.isError ? <Text style={styles.error}>Não foi possível salvar. Use números de 1 a 10.</Text> : null}
      </Card>
      <Card>
        <Text style={styles.title}>Últimos 14 dias</Text>
        {(history.data?.data ?? []).length === 0 ? <Empty text="Nenhum registro ainda." /> : null}
        {(history.data?.data ?? []).map((row) => (
          <View key={row.id} style={styles.row}>
            <Text style={styles.date}>{row.date}</Text>
            <Text style={styles.hint}>
              E{row.energy ?? "—"} · S{row.sleep ?? "—"} · D{row.musclePain ?? "—"}
            </Text>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  list: { padding: space.lg, gap: space.md },
  title: { color: colors.ink, fontSize: 16, fontWeight: "700" },
  hint: { color: colors.muted, fontSize: 13, marginBottom: space.sm },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: space.sm, marginBottom: space.md },
  cell: { width: "48%" },
  error: { color: colors.maroon, marginTop: space.sm },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingVertical: space.sm,
  },
  date: { color: colors.ink },
});
