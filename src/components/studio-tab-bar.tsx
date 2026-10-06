"use no memo";

import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { colors, font, radius, shadow, space } from "@/theme";

type StudioTabBarProps = {
  state: {
    index: number;
    routes: { key: string; name: string; params?: object }[];
  };
  descriptors: Record<
    string,
    {
      options: {
        title?: string;
        tabBarAccessibilityLabel?: string;
      };
    }
  >;
  navigation: {
    emit: (event: {
      type: "tabPress";
      target: string;
      canPreventDefault: true;
    }) => { defaultPrevented: boolean };
    navigate: (name: string, params?: object) => void;
  };
  insets: { bottom: number };
};

const ICONS = {
  treino: "barbell-outline",
  bio: "pulse-outline",
  pagamentos: "receipt-outline",
  avaliacao: "body-outline",
};

export function StudioTabBar({ state, descriptors, navigation, insets }: StudioTabBarProps) {
  const reduced = useReducedMotion();
  const index = useSharedValue(state.index);
  const tabWidth = useSharedValue(0);

  useEffect(() => {
    index.value = withTiming(state.index, { duration: reduced ? 0 : 240 });
  }, [index, reduced, state.index]);

  const indicator = useAnimatedStyle(() => ({
    transform: [{ translateX: index.value * tabWidth.value + (tabWidth.value - 28) / 2 }],
  }));

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, space.sm) }]}>
      <View
        onLayout={(event) => {
          const count = state.routes.length || 1;
          tabWidth.value = event.nativeEvent.layout.width / count;
        }}
        style={styles.tabs}
      >
        <Animated.View style={[styles.indicator, indicator]} />
        {state.routes.map((route, routeIndex) => {
          const focused = state.index === routeIndex;
          const options = descriptors[route.key]?.options;
          const color = focused ? colors.navy : colors.muted;
          const label = options?.title ?? route.name;
          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={options?.tabBarAccessibilityLabel ?? label}
              onPress={() => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!focused && !event.defaultPrevented) {
                  navigation.navigate(route.name, route.params);
                }
              }}
              style={({ pressed }) => [
                styles.tab,
                focused ? styles.tabActive : null,
                pressed ? styles.tabPressed : null,
              ]}
            >
              <Ionicons
                name={(ICONS as Record<string, "barbell-outline">)[route.name] ?? "ellipse-outline"}
                color={color}
                size={22}
              />
              <Text style={[styles.label, { color, fontFamily: focused ? font.bodyBold : font.bodyMedium }]}>
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    borderTopLeftRadius: radius.card,
    borderTopRightRadius: radius.card,
    ...shadow.nav,
  },
  tabs: {
    flexDirection: "row",
    paddingTop: 7,
  },
  indicator: {
    position: "absolute",
    top: 4,
    left: 0,
    width: 28,
    height: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.navy,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    gap: 2,
    minHeight: 52,
    justifyContent: "center",
    borderRadius: radius.input,
  },
  tabActive: { backgroundColor: "rgba(0,32,96,0.06)" },
  tabPressed: { opacity: 0.72 },
  label: { fontSize: 11 },
});
