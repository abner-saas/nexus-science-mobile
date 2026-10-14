import type { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  type StyleProp,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BrandLockup } from "@/components/brand-lockup";
import { colors, font, radius, shadow, space } from "@/theme";

export function Screen({
  children,
  tone = "studio",
}: {
  children: ReactNode;
  tone?: "studio" | "navy";
}) {
  return (
    <SafeAreaView
      style={[styles.screen, tone === "navy" ? styles.screenNavy : null]}
      edges={["top", "left", "right"]}
    >
      <View style={styles.frame}>{children}</View>
    </SafeAreaView>
  );
}

export function BrandHeader({ title, action }: { title?: string; action?: ReactNode }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerText}>
        <BrandLockup markSize={36} tone="dark" />
        {title ? <Text style={styles.headerTitle}>{title}</Text> : null}
      </View>
      {action}
    </View>
  );
}

export function Card({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Field({ label, ...input }: { label: string } & TextInputProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput placeholderTextColor={colors.muted} autoCapitalize="none" style={styles.input} {...input} />
    </View>
  );
}

export function Button({
  label,
  onPress,
  disabled,
  loading,
  variant = "primary",
  onDark = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "ghost" | "maroon" | "plate";
  onDark?: boolean;
}) {
  const inactive = disabled || loading;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={inactive}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        variant === "primary" ? styles.buttonPrimary : null,
        variant === "maroon" ? styles.buttonMaroon : null,
        variant === "plate" ? styles.buttonPlate : null,
        variant === "ghost" ? styles.buttonGhost : null,
        inactive || pressed ? styles.buttonDim : null,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "plate" || variant === "ghost" ? colors.navy : colors.white} />
      ) : (
        <Text
          style={[
            styles.buttonLabel,
            variant === "ghost" ? (onDark ? styles.buttonLabelOnDark : styles.buttonLabelGhost) : null,
            variant === "plate" ? styles.buttonLabelPlate : null,
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

export function Empty({ text }: { text: string }) {
  return <Text style={styles.empty}>{text}</Text>;
}

export function ErrorText({ text }: { text: string | null }) {
  if (!text) return null;
  return <Text style={styles.error}>{text}</Text>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  screenNavy: { backgroundColor: colors.navy },
  frame: { flex: 1, width: "100%", maxWidth: 480, alignSelf: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: space.lg,
    paddingTop: space.sm,
    paddingBottom: space.md,
    backgroundColor: colors.navy,
    borderBottomLeftRadius: radius.card,
    borderBottomRightRadius: radius.card,
    zIndex: 2,
    ...shadow.card,
  },
  headerText: { flex: 1, paddingRight: space.md },
  brand: { fontFamily: font.display, color: colors.white, fontSize: 28, lineHeight: 30, letterSpacing: 0.5 },
  headerTitle: { fontFamily: font.body, color: "rgba(255,255,255,0.82)", fontSize: 15, marginTop: 2 },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.line,
    padding: space.lg,
    ...shadow.card,
  },
  field: { gap: space.xs },
  label: { color: colors.ink, fontSize: 13, fontFamily: font.bodyMedium },
  input: {
    backgroundColor: colors.input,
    borderRadius: radius.input,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: space.md,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.ink,
    fontFamily: font.body,
  },
  button: {
    minHeight: 48,
    borderRadius: radius.button,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: space.lg,
  },
  buttonPrimary: { backgroundColor: colors.navy, ...shadow.button },
  buttonMaroon: { backgroundColor: colors.maroon },
  buttonPlate: { backgroundColor: colors.maroon },
  buttonGhost: { backgroundColor: "transparent" },
  buttonDim: { opacity: 0.65 },
  buttonLabel: { color: colors.white, fontFamily: font.bodyBold, fontSize: 15 },
  buttonLabelGhost: { color: colors.navy },
  buttonLabelOnDark: { color: colors.white },
  buttonLabelPlate: { color: colors.white },
  empty: { color: colors.muted, fontSize: 14, marginTop: space.sm, fontFamily: font.body },
  error: {
    color: colors.danger,
    backgroundColor: "rgba(220,38,38,0.08)",
    borderRadius: radius.input,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    fontSize: 14,
    fontFamily: font.body,
  },
});
