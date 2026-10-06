"use no memo";

import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { DUE_MARKS, daysUntilDue, dueMarkerPosition } from "@/lib/due";
import { colors, font, space } from "@/theme";

export function DueRuler({
  dueDate,
  status,
}: {
  dueDate?: string | null;
  status?: string | null;
}) {
  const reduced = useReducedMotion();
  const [width, setWidth] = useState(0);
  const travel = useSharedValue(0);
  const settled = status === "CONFIRMED";
  const days = dueDate ? daysUntilDue(dueDate) : null;
  const position = days == null || settled ? 0 : dueMarkerPosition(days);
  const overdue = status === "OVERDUE" || (days != null && days < 0 && !settled);

  useEffect(() => {
    const next = settled || days == null ? 0 : position * width - 7;
    travel.value = withTiming(next, { duration: reduced ? 0 : 320 });
  }, [days, position, reduced, settled, travel, width]);

  const marker = useAnimatedStyle(() => ({
    transform: [{ translateX: travel.value }],
  }));

  const label =
    days == null
      ? "Régua de vencimento sem data"
      : `Régua de vencimento. ${days} dias em relação ao vencimento. Marcos D-7, D-3, D-0 e D+1.`;

  return (
    <View accessibilityLabel={label} style={styles.wrap}>
      <View style={styles.track} onLayout={(event) => setWidth(event.nativeEvent.layout.width)}>
        <View style={styles.line} />
        {DUE_MARKS.map((mark, index) => {
          const center = width === 0 ? 0 : (index / (DUE_MARKS.length - 1)) * width;
          return (
            <View key={mark.id} style={[styles.tickSlot, { left: center - 18 }]}>
              <View style={[styles.tick, settled ? styles.tickSettled : null]} />
              <Text style={styles.tickLabel}>{mark.id}</Text>
            </View>
          );
        })}
        {dueDate && !settled ? (
          <Animated.View style={[styles.marker, overdue ? styles.markerLate : null, marker]} />
        ) : null}
      </View>
      {settled ? <Text style={styles.note}>Pago</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.sm, marginTop: space.sm, paddingHorizontal: 10 },
  track: {
    height: 42,
    justifyContent: "flex-start",
  },
  line: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 6,
    height: 2,
    backgroundColor: colors.line,
  },
  tickSlot: { position: "absolute", top: 0, width: 36, alignItems: "center" },
  tick: { width: 2, height: 14, backgroundColor: colors.navy },
  tickSettled: { backgroundColor: colors.navy, opacity: 0.35 },
  tickLabel: {
    marginTop: 4,
    fontFamily: font.bodyMedium,
    fontSize: 11,
    color: colors.ink,
  },
  marker: {
    position: "absolute",
    top: 0,
    zIndex: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.navy,
    borderWidth: 2,
    borderColor: colors.white,
  },
  markerLate: { backgroundColor: colors.maroon },
  note: { fontFamily: font.bodyMedium, color: colors.navy, fontSize: 13 },
});
