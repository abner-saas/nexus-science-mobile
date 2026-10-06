import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { EvolutionChart } from "@/components/evolution-chart";
import { api, type Assessment } from "@/lib/api";
import { formatDateBr } from "@/lib/format";
import { colors, font, radius, shadow, space } from "@/theme";

export function AvaliacaoScreen({ studentId }: { studentId: string }) {
  const assessments = useQuery({
    queryKey: ["assessments", studentId],
    queryFn: () => api.assessments(studentId),
  });
  const rows = assessments.data?.data ?? [];
  const shots = [...rows]
    .sort((a, b) => a.date.localeCompare(b.date))
    .flatMap((row) => (row.photoUrls ?? []).map((url) => ({ url, date: row.date, id: row.id })));

  return (
    <ScrollView contentContainerStyle={styles.list} style={styles.scroll}>
      {assessments.isLoading ? <Text style={styles.meta}>Carregando avaliações</Text> : null}
      {assessments.isSuccess ? <EvolutionChart rows={rows} /> : null}
      {shots.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photos}>
          {shots.map((shot) => (
            <View key={`${shot.id}-${shot.url}`} style={styles.shot}>
              <Image source={{ uri: shot.url }} style={styles.photo} contentFit="cover" accessibilityLabel={`Foto de ${formatDateBr(shot.date)}`} />
              <Text style={styles.meta}>{formatDateBr(shot.date)}</Text>
            </View>
          ))}
        </ScrollView>
      ) : null}
      {rows.map((row) => (
        <AssessmentSheet key={row.id} row={row} />
      ))}
    </ScrollView>
  );
}

function AssessmentSheet({ row }: { row: Assessment }) {
  const figures = [
    ["Peso", row.weight, "kg"],
    ["Gordura", row.bodyFat, "%"],
    ["IMC", row.bmi, ""],
    ["Músculo", row.muscle, "%"],
  ] as const;

  return (
    <View style={styles.sheet}>
      <Text style={styles.date}>{formatDateBr(row.date)}</Text>
      <View style={styles.grid}>
        {figures.map(([label, value, unit]) => (
          <View key={label} style={styles.figure}>
            <Text style={styles.figureLabel}>{label}</Text>
            <Text style={styles.figureValue}>{value ?? "—"}</Text>
            {unit && value ? <Text style={styles.unit}>{unit}</Text> : null}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.background },
  list: { padding: space.lg, gap: space.md, paddingBottom: space.xl },
  meta: { fontFamily: font.body, fontSize: 13, color: colors.muted },
  photos: { gap: space.sm, paddingVertical: space.xs },
  shot: {
    width: 120,
    gap: 4,
    borderRadius: radius.card,
    backgroundColor: colors.white,
    paddingBottom: space.sm,
    overflow: "hidden",
  },
  photo: { width: 120, height: 160, backgroundColor: colors.input },
  sheet: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.line,
    padding: space.lg,
    gap: space.sm,
    ...shadow.card,
  },
  date: { fontFamily: font.titleSoft, fontSize: 16, color: colors.navy },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: space.md },
  figure: { width: "46%", gap: 2 },
  figureLabel: { fontFamily: font.body, fontSize: 12, color: colors.muted },
  figureValue: { fontFamily: font.display, fontSize: 32, lineHeight: 34, color: colors.ink },
  unit: { fontFamily: font.body, fontSize: 12, color: colors.muted },
});
