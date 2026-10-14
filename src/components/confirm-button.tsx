"use no memo";

import { useEffect, useRef } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { colors, font, radius, shadow, space } from "@/theme";

export function ConfirmButton({
  label,
  confirmedLabel,
  confirmed,
  pulse,
  loading,
  onPress,
}: {
  label: string;
  confirmedLabel: string;
  confirmed: boolean;
  pulse: number;
  loading?: boolean;
  onPress: () => void;
}) {
  const reduced = useReducedMotion();
  const bar = useSharedValue(0);
  const fill = useSharedValue(confirmed ? 1 : 0);
  const check = useSharedValue(confirmed ? 1 : 0);
  const mounted = useRef(false);

  useEffect(() => {
    const instant = !mounted.current || reduced;
    mounted.current = true;
    if (!instant && pulse > 0) {
      fill.value = withSequence(withTiming(0, { duration: 0 }), withTiming(1, { duration: 320 }));
      check.value = withSequence(withTiming(0, { duration: 0 }), withDelay(140, withTiming(1, { duration: 180 })));
      return;
    }
    fill.value = withTiming(confirmed ? 1 : 0, { duration: instant ? 0 : 320 });
    check.value = withTiming(confirmed ? 1 : 0, { duration: instant ? 0 : 180 });
  }, [check, confirmed, fill, pulse, reduced]);

  const fillStyle = useAnimatedStyle(() => ({ width: fill.value * bar.value }));
  const checkStyle = useAnimatedStyle(() => ({
    opacity: check.value,
    transform: [{ scale: 0.7 + check.value * 0.3 }],
  }));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ busy: loading, selected: confirmed }}
      accessibilityLiveRegion="polite"
      disabled={loading}
      onPress={onPress}
      onLayout={(event) => {
        bar.value = event.nativeEvent.layout.width;
      }}
      style={({ pressed }) => [styles.button, pressed ? styles.pressed : null]}
    >
      <Animated.View style={[styles.fill, fillStyle]} />
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <View style={styles.row}>
          {confirmed ? (
            <Animated.View style={checkStyle}>
              <Ionicons name="checkmark" size={18} color={colors.white} />
            </Animated.View>
          ) : null}
          <Text style={styles.label}>{confirmed ? confirmedLabel : label}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: radius.button,
    backgroundColor: colors.navy,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    paddingHorizontal: space.lg,
    ...shadow.button,
  },
  pressed: { opacity: 0.88 },
  fill: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.maroon,
  },
  row: { flexDirection: "row", alignItems: "center", gap: space.sm, zIndex: 1 },
  label: { color: colors.white, fontFamily: font.bodyBold, fontSize: 15 },
});
