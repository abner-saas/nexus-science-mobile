"use no memo";

import { useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { WEEK_LABELS } from "@/lib/week";
import { colors, font, radius, shadow, space } from "@/theme";

export type RailDay = {
  label: string;
  codes: string[];
  prescribed: boolean;
  done: boolean;
  today: boolean;
};

export function WeekRail({ days }: { days: RailDay[] }) {
  const prescribed = days.filter((day) => day.prescribed).map((day) => day.label);
  const done = days.filter((day) => day.done).map((day) => day.label);
  const summary = [
    prescribed.length ? `Prescrito: ${prescribed.join(", ")}` : "Nenhum dia prescrito",
    done.length ? `Feito: ${done.join(", ")}` : "Nenhuma sessão nesta semana",
  ].join(". ");

  return (
    <View accessibilityLabel={summary} style={styles.wrap}>
      <View style={styles.row}>
        {days.map((day) => (
          <DayCell key={day.label} day={day} />
        ))}
      </View>
      <View style={styles.legend}>
        <Swatch color={colors.navy} label="prescrito" />
        <Swatch color={colors.maroon} label="feito" />
      </View>
    </View>
  );
}

function DayCell({ day }: { day: RailDay }) {
  const reduced = useReducedMotion();
  const scale = useSharedValue(1);
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (!day.done || reduced) return;
    scale.value = withSequence(withTiming(0.84, { duration: 90 }), withTiming(1, { duration: 180 }));
  }, [day.done, reduced, scale]);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const code = day.codes.slice(0, 2).join("");

  return (
    <View style={styles.cell}>
      <Text style={[styles.weekday, day.today ? styles.todayLabel : null]}>{day.label}</Text>
      <Animated.View
        style={[
          styles.mark,
          day.prescribed ? styles.prescribed : null,
          day.done ? styles.done : null,
          day.today ? styles.today : null,
          style,
        ]}
      >
        {code ? (
          <Text style={[styles.code, day.done ? styles.codeOn : null]}>{code}</Text>
        ) : (
          <View style={[styles.tick, day.done ? styles.tickOn : null]} />
        )}
      </Animated.View>
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

export function emptyWeek(): RailDay[] {
  return WEEK_LABELS.map((label) => ({
    label,
    codes: [],
    prescribed: false,
    done: false,
    today: false,
  }));
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: space.lg,
    marginTop: space.md,
    backgroundColor: colors.white,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: space.md,
    paddingTop: space.md,
    paddingBottom: space.sm,
    gap: space.sm,
    ...shadow.card,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  cell: { alignItems: "center", width: 40, gap: 6 },
  weekday: { fontFamily: font.bodyMedium, fontSize: 12, color: colors.muted },
  todayLabel: { color: colors.navy, fontFamily: font.bodyBold },
  mark: {
    width: 36,
    height: 36,
    borderRadius: radius.input,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "transparent",
  },
  prescribed: { borderColor: colors.navy, backgroundColor: "rgba(0,32,96,0.06)" },
  done: { backgroundColor: colors.maroon, borderColor: colors.maroon },
  today: { borderWidth: 2 },
  code: { fontFamily: font.display, fontSize: 18, color: colors.navy, lineHeight: 20 },
  codeOn: { color: colors.white },
  tick: { width: 8, height: 2, backgroundColor: colors.line },
  tickOn: { backgroundColor: colors.white },
  legend: { flexDirection: "row", gap: space.lg },
  swatchRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  swatch: { width: 8, height: 8, borderRadius: radius.pill },
  swatchLabel: { fontFamily: font.body, fontSize: 12, color: colors.ink },
});
