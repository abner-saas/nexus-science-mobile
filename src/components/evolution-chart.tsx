import { StyleSheet, Text, View } from "react-native";
import type { Assessment } from "@/lib/api";
import { formatDateBr } from "@/lib/format";
import { colors, font, radius, shadow, space } from "@/theme";
import { MuscleMark } from "@/components/muscle-mark";

type Point = { date: string; weight: number | null; fat: number | null };

const CHART = 112;

function asNumber(value: string | null | undefined): number | null {
  if (value == null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function peak(values: Array<number | null>): number {
  const nums = values.filter((value): value is number => value != null && value > 0);
  return nums.length ? Math.max(...nums) : 1;
}

export function pointsFrom(rows: Assessment[]): Point[] {
  return rows
    .map((row) => ({
      date: row.date.slice(0, 10),
      weight: asNumber(row.weight),
      fat: asNumber(row.bodyFat),
    }))
    .filter((point) => point.weight != null || point.fat != null)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-6);
}

export function EvolutionChart({ rows }: { rows: Assessment[] }) {
  const points = pointsFrom(rows);
  if (points.length === 0) return <EmptyCurve />;

  const weightMax = peak(points.map((point) => point.weight));
  const fatMax = peak(points.map((point) => point.fat));
  const first = points[0];
  const last = points[points.length - 1];
  const summary = `Evolução de ${points.length} avaliações. Peso ${first.weight ?? "sem valor"} a ${last.weight ?? "sem valor"} kg. Gordura ${first.fat ?? "sem valor"} a ${last.fat ?? "sem valor"} por cento.`;

  return (
    <View accessibilityLabel={summary} style={styles.sheet}>
      <Text style={styles.title}>Evolução</Text>
      <View style={styles.legend}>
        <Swatch color={colors.navy} label="Peso" />
        <Swatch color={colors.maroon} label="Gordura" />
      </View>
      <View style={styles.plot}>
        <View style={styles.baseline} />
        {points.map((point) => (
          <View key={point.date} style={styles.column}>
            <View style={styles.bars}>
              <Bar value={point.weight} max={weightMax} color={colors.navy} />
              <Bar value={point.fat} max={fatMax} color={colors.maroon} />
            </View>
            <Text style={styles.date}>{formatDateBr(point.date).slice(0, 5)}</Text>
          </View>
        ))}
      </View>
      <Text style={styles.note}>Cada série usa a própria escala, para as duas caberem no mesmo desenho.</Text>
    </View>
  );
}

function Bar({ value, max, color }: { value: number | null; max: number; color: string }) {
  const height = value == null ? 0 : Math.max(4, (value / max) * CHART);
  return <View style={{ width: 10, height, borderRadius: 5, backgroundColor: color }} />;
}

function EmptyCurve() {
  return (
    <View
      accessibilityLabel="Ainda não há peso nem gordura para desenhar a evolução."
      style={styles.empty}
    >
      <MuscleMark group="Corpo" />
      <View style={styles.emptyCopy}>
        <View style={styles.ghostPlot}>
          <View style={styles.baseline} />
          <View style={styles.ghostBar} />
          <View style={[styles.ghostBar, { height: 28 }]} />
          <View style={[styles.ghostBar, { height: 16 }]} />
        </View>
        <Text style={styles.emptyText}>A primeira avaliação desenha peso e gordura aqui.</Text>
      </View>
    </View>
  );
}

function Swatch({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.swatchRow}>
      <View style={[styles.swatch, { backgroundColor: color }]} />
      <Text style={styles.swatchLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.line,
    padding: space.lg,
    gap: space.sm,
    ...shadow.card,
  },
  title: { fontFamily: font.title, fontSize: 18, color: colors.ink },
  legend: { flexDirection: "row", gap: space.lg },
  swatchRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  swatch: { width: 8, height: 8, borderRadius: radius.pill },
  swatchLabel: { fontFamily: font.body, fontSize: 13, color: colors.ink },
  plot: {
    height: CHART + 22,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    gap: space.sm,
  },
  baseline: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 18,
    height: 1,
    backgroundColor: colors.line,
  },
  column: { alignItems: "center", gap: 4, flex: 1 },
  bars: { flexDirection: "row", alignItems: "flex-end", gap: 3, height: CHART },
  date: { fontFamily: font.body, fontSize: 11, color: colors.muted },
  note: { fontFamily: font.body, fontSize: 12, color: colors.muted, lineHeight: 18 },
  empty: {
    flexDirection: "row",
    gap: space.md,
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.line,
    padding: space.lg,
    ...shadow.card,
  },
  emptyCopy: { flex: 1, gap: space.sm },
  ghostPlot: { height: 48, justifyContent: "flex-end", flexDirection: "row", alignItems: "flex-end", gap: 8 },
  ghostBar: { width: 10, height: 10, borderRadius: 5, backgroundColor: "rgba(0,32,96,0.18)" },
  emptyText: { fontFamily: font.body, fontSize: 15, color: colors.ink, lineHeight: 22 },
});
