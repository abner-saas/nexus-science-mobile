import type { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, space } from "@/theme";

export function Screen({ children }: { children: ReactNode }) {
  return (
    <SafeAreaView style={styles.screen} edges={["top", "left", "right"]}>
      {children}
    </SafeAreaView>
  );
}

export function BrandHeader({
  subtitle,
  action,
}: {
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <View style={styles.header}>
      <View style={styles.headerText}>
        <Text style={styles.brand}>Nexus Science</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {action}
    </View>
  );
}

export function Card({ children }: { children: ReactNode }) {
  return <View style={styles.card}>{children}</View>;
}

export function Field({
  label,
  ...input
}: { label: string } & TextInputProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.muted}
        autoCapitalize="none"
        style={styles.input}
        {...input}
      />
    </View>
  );
}

export function Button({
  label,
  onPress,
  disabled,
  loading,
  variant = "primary",
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "ghost" | "maroon";
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
        variant === "ghost" ? styles.buttonGhost : null,
        inactive || pressed ? styles.buttonDim : null,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === "ghost" ? colors.navy : colors.white} />
      ) : (
        <Text style={[styles.buttonLabel, variant === "ghost" ? styles.buttonLabelGhost : null]}>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  headerText: { flex: 1, paddingRight: space.md },
  brand: { color: colors.navy, fontSize: 22, fontWeight: "700", letterSpacing: 0.4 },
  subtitle: { color: colors.muted, marginTop: 2, fontSize: 14 },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    padding: space.lg,
  },
  field: { gap: space.xs },
  label: { color: colors.ink, fontSize: 13, fontWeight: "600" },
  input: {
    backgroundColor: colors.input,
    borderRadius: 10,
    paddingHorizontal: space.md,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.ink,
  },
  button: {
    minHeight: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: space.lg,
  },
  buttonPrimary: { backgroundColor: colors.navy },
  buttonMaroon: { backgroundColor: colors.maroon },
  buttonGhost: { backgroundColor: "transparent" },
  buttonDim: { opacity: 0.65 },
  buttonLabel: { color: colors.white, fontWeight: "700", fontSize: 15 },
  buttonLabelGhost: { color: colors.navy },
  empty: { color: colors.muted, fontSize: 14, marginTop: space.sm },
  error: { color: colors.maroon, fontSize: 14 },
});
