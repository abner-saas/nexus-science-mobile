import { StyleSheet, Text, View } from "react-native";
import { BrandLockup } from "@/components/brand-lockup";
import { colors, font, space } from "@/theme";

export function AuthMast() {
  return (
    <View style={styles.mast}>
      <BrandLockup markSize={72} tone="dark" />
      <Text style={styles.place}>Abner Lucas, Recife</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mast: { paddingHorizontal: space.xl, paddingTop: space.lg, paddingBottom: space.xl, gap: space.md },
  place: { fontFamily: font.body, color: "rgba(255,255,255,0.78)", fontSize: 15 },
});
