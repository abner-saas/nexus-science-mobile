"use no memo";

import type { ComponentProps } from "react";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { colors, font, radius, space } from "@/theme";

const VALUES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export type Meter = {
  key: string;
  label: string;
  prompt: string;
  lowLabel: string;
  highLabel: string;
  icon: ComponentProps<typeof Ionicons>["name"];
  value: number;
  tone: "capacity" | "load";
};

export function MetricBars({
  meters,
  onChange,
}: {
  meters: Meter[];
  onChange: (key: string, value: number) => void;
}) {
  return (
    <View style={styles.list}>
      {meters.map((meter) => (
        <MeterCard key={meter.key} meter={meter} onChange={onChange} />
      ))}
    </View>
  );
}

function MeterCard({
  meter,
  onChange,
}: {
  meter: Meter;
  onChange: (key: string, value: number) => void;
}) {
  const reduced = useReducedMotion();
  const [trackWidth, setTrackWidth] = useState(0);
  const target = (meter.value / 10) * trackWidth;
  const width = useSharedValue(reduced ? target : 0);

  useEffect(() => {
    width.value = withTiming(target, { duration: reduced ? 0 : 260 });
  }, [reduced, target, width]);

  const fill = useAnimatedStyle(() => ({ width: width.value }));
  const color = meter.tone === "load" ? colors.maroon : colors.navy;

  return (
    <View style={styles.card}>
      <View style={styles.heading}>
        <View style={[styles.icon, { backgroundColor: `${color}12` }]}>
          <Ionicons color={color} name={meter.icon} size={20} />
        </View>
        <View style={styles.copy}>
          <Text style={styles.label}>{meter.label}</Text>
          <Text style={styles.prompt}>{meter.prompt}</Text>
        </View>
        <View style={[styles.valueBadge, { borderColor: `${color}30` }]}>
          <Text style={[styles.value, { color }]}>{meter.value}</Text>
          <Text style={styles.unit}>/10</Text>
        </View>
      </View>
      <View
        onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
        style={styles.track}
      >
        <Animated.View style={[styles.fill, { backgroundColor: color }, fill]} />
      </View>
      <View style={styles.ends}>
        <Text style={styles.endLabel}>1 · {meter.lowLabel}</Text>
        <Text style={styles.endLabel}>10 · {meter.highLabel}</Text>
      </View>
      <View style={styles.choices}>
        {[VALUES.slice(0, 5), VALUES.slice(5)].map((row) => (
          <View key={row[0]} style={styles.choiceRow}>
            {row.map((choice) => {
              const selected = choice === meter.value;
              return (
                <Pressable
                  key={choice}
                  accessibilityLabel={`${meter.label}: ${choice} de 10`}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  onPress={() => onChange(meter.key, choice)}
                  style={({ pressed }) => [
                    styles.choice,
                    selected ? { backgroundColor: color, borderColor: color } : null,
                    pressed ? styles.pressed : null,
                  ]}
                >
                  <Text style={[styles.choiceLabel, selected ? styles.choiceLabelSelected : null]}>
                    {choice}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

export function MiniMeters({
  values,
}: {
  values: Array<{ value: number | null; tone: "capacity" | "load" }>;
}) {
  return (
    <View style={styles.miniRow}>
      {values.map((item, index) => {
        const height = item.value == null ? 2 : Math.max(2, (Math.min(10, item.value) / 10) * 18);
        const color = item.tone === "load" ? colors.maroon : colors.navy;
        return <View key={index} style={[styles.mini, { height, backgroundColor: color }]} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: space.md },
  card: {
    gap: space.sm,
    borderRadius: radius.button,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.card,
    padding: space.sm,
  },
  heading: { flexDirection: "row", alignItems: "center", gap: space.sm },
  icon: {
    width: 40,
    height: 40,
    borderRadius: radius.input,
    alignItems: "center",
    justifyContent: "center",
  },
  copy: { flex: 1 },
  label: { fontFamily: font.titleSoft, fontSize: 14, color: colors.ink },
  prompt: { fontFamily: font.body, fontSize: 12, lineHeight: 17, color: colors.muted },
  valueBadge: {
    minWidth: 54,
    minHeight: 40,
    borderRadius: radius.input,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    paddingHorizontal: space.sm,
  },
  value: { fontFamily: font.display, fontSize: 27, lineHeight: 34 },
  unit: { fontFamily: font.bodyMedium, fontSize: 11, color: colors.muted },
  track: {
    height: 6,
    borderRadius: radius.pill,
    overflow: "hidden",
    backgroundColor: "rgba(0,32,96,0.06)",
  },
  fill: { height: 6, borderRadius: radius.pill },
  ends: { flexDirection: "row", justifyContent: "space-between" },
  endLabel: { fontFamily: font.body, fontSize: 11, color: colors.muted },
  choices: { gap: 6 },
  choiceRow: { flexDirection: "row", gap: 3 },
  choice: {
    flex: 1,
    minHeight: 44,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.input,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: { opacity: 0.7 },
  choiceLabel: { fontFamily: font.bodyBold, fontSize: 14, color: colors.ink },
  choiceLabelSelected: { color: colors.white },
  miniRow: { flexDirection: "row", alignItems: "flex-end", gap: 3, height: 18 },
  mini: { width: 5, borderRadius: 3 },
});
