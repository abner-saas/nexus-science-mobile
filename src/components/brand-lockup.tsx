import { useId } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Defs, Image as SvgImage, Mask, Rect } from "react-native-svg";
import { colors, font } from "@/theme";

const MARK = require("../../assets/images/nexus-mark.png") as unknown;

/** Metro entrega string, número ou `{ uri }` conforme a plataforma. */
function markHref(asset: unknown): string | number {
  if (typeof asset === "string" || typeof asset === "number") return asset;
  if (asset && typeof asset === "object" && "uri" in asset) {
    const uri = (asset as { uri?: unknown }).uri;
    if (typeof uri === "string") return uri;
  }
  return "";
}

/**
 * O PNG é a forma (o arquivo em si é dourado). A cor é o vinho `#800000`,
 * igual ao `mask-image` + `bg-maroon` do site.
 */
function Mark({ size }: { size: number }) {
  const id = `nexus-mark-${useId().replace(/:/g, "")}`;
  const href = markHref(MARK);

  return (
    <Svg height={size} viewBox={`0 0 ${size} ${size}`} width={size}>
      <Defs>
        <Mask height={size} id={id} maskUnits="userSpaceOnUse" width={size} x={0} y={0}>
          <SvgImage height={size} href={href} preserveAspectRatio="xMidYMid meet" width={size} />
        </Mask>
      </Defs>
      <Rect fill={colors.maroon} height={size} mask={`url(#${id})`} width={size} />
    </Svg>
  );
}

export function BrandLockup({
  tone = "light",
  markSize = 42,
}: {
  tone?: "light" | "dark";
  markSize?: number;
}) {
  const onDark = tone === "dark";
  const titleSize = markSize >= 64 ? 34 : markSize >= 40 ? 22 : 16;

  return (
    <View accessibilityRole="header" style={styles.row}>
      <Mark size={markSize} />
      <View style={styles.words}>
        <Text
          style={[
            styles.name,
            { color: onDark ? colors.white : colors.navy, fontSize: titleSize, lineHeight: titleSize + 2 },
          ]}
        >
          Nexus Science
        </Text>
        <Text style={[styles.line, { color: onDark ? "rgba(255,255,255,0.72)" : colors.muted }]}>
          Consultoria online
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 10 },
  words: { flexShrink: 1 },
  name: { fontFamily: font.display, letterSpacing: 0.6 },
  line: { fontFamily: font.bodyBold, fontSize: 10, letterSpacing: 1.2, marginTop: 2 },
});
