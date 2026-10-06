"use no memo";

import { useCallback, useEffect, type ReactNode } from "react";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useFocusEffect } from "expo-router";

export function Enter({ index, children }: { index: number; children: ReactNode }) {
  const reduced = useReducedMotion();
  const opacity = useSharedValue(reduced ? 1 : 0);
  const offset = useSharedValue(reduced ? 0 : 12);

  useEffect(() => {
    const delay = reduced ? 0 : Math.min(index, 4) * 60;
    const duration = reduced ? 0 : 240;
    opacity.value = withDelay(delay, withTiming(1, { duration }));
    offset.value = withDelay(delay, withTiming(0, { duration }));
  }, [index, offset, opacity, reduced]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: offset.value }],
  }));

  return <Animated.View style={style}>{children}</Animated.View>;
}

/** Desliza o conteúdo quando a aba ganha foco. O toque não espera a animação. */
export function TabMotion({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const opacity = useSharedValue(1);
  const offset = useSharedValue(0);

  useFocusEffect(
    useCallback(() => {
      if (reduced) {
        opacity.value = 1;
        offset.value = 0;
        return;
      }
      opacity.value = withSequence(withTiming(0.35, { duration: 0 }), withTiming(1, { duration: 260 }));
      offset.value = withSequence(withTiming(16, { duration: 0 }), withTiming(0, { duration: 260 }));
    }, [offset, opacity, reduced]),
  );

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: offset.value }],
  }));

  return <Animated.View style={[{ flex: 1 }, style]}>{children}</Animated.View>;
}
