import { View } from "react-native";
import Svg, { Path } from "react-native-svg";
import type { Slug } from "react-native-body-highlighter";
// The package's public component always attaches press responders to every SVG
// path, even in read-only mode. React 19 warns about those handlers on web, so
// we reuse its MIT-licensed anatomical path data with a passive renderer.
import { bodyFront } from "react-native-body-highlighter/dist/assets/bodyFront";
import { bodyBack } from "react-native-body-highlighter/dist/assets/bodyBack";
import { colors } from "@/theme";

type MuscleSelection = {
  side: "front" | "back";
  slugs: Slug[];
};

type AnatomicalPart = {
  slug?: Slug;
  path?: {
    common?: string[];
    left?: string[];
    right?: string[];
  };
};

const anatomicalBodies: Record<MuscleSelection["side"], AnatomicalPart[]> = {
  front: bodyFront,
  back: bodyBack,
};

function musclesFor(group: string): MuscleSelection {
  const name = group
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
  if (/peitor|peito|chest/.test(name)) return { side: "front", slugs: ["chest"] };
  if (/costas|dorsal/.test(name)) return { side: "back", slugs: ["upper-back", "lower-back"] };
  if (/trap/.test(name)) return { side: "back", slugs: ["trapezius"] };
  if (/lombar/.test(name)) return { side: "back", slugs: ["lower-back"] };
  if (/ombro|delt/.test(name)) return { side: "front", slugs: ["deltoids"] };
  if (/tricep/.test(name)) return { side: "back", slugs: ["triceps"] };
  if (/bicep/.test(name)) return { side: "front", slugs: ["biceps"] };
  if (/antebr/.test(name)) return { side: "front", slugs: ["forearm"] };
  if (/braco/.test(name)) return { side: "front", slugs: ["biceps", "forearm"] };
  if (/abd|core/.test(name)) return { side: "front", slugs: ["abs"] };
  if (/obliq/.test(name)) return { side: "front", slugs: ["obliques"] };
  if (/glute/.test(name)) return { side: "back", slugs: ["gluteal"] };
  if (/panturr/.test(name)) return { side: "back", slugs: ["calves"] };
  if (/isquio|posterior/.test(name)) return { side: "back", slugs: ["hamstring"] };
  if (/adutor/.test(name)) return { side: "front", slugs: ["adductors"] };
  if (/quad|femor/.test(name)) return { side: "front", slugs: ["quadriceps"] };
  if (/membro.*inferior|perna/.test(name)) {
    return { side: "front", slugs: ["quadriceps", "adductors", "tibialis"] };
  }
  return { side: "front", slugs: [] };
}

export function MuscleMark({
  group,
  onDark = false,
  size = "sm",
}: {
  group: string;
  onDark?: boolean;
  size?: "sm" | "lg";
}) {
  const { side, slugs } = musclesFor(group);
  const bodyWidth = size === "lg" ? 90 : 56;
  const bodyHeight = bodyWidth * 2;
  const viewBox = side === "front" ? "0 0 724 1448" : "724 0 724 1448";
  const activeMuscles = new Set(slugs);
  const neutralFill = onDark ? "rgba(255,255,255,0.18)" : "#E8EEF3";
  const neutralStroke = onDark ? "rgba(255,255,255,0.38)" : "#9CB4C8";

  return (
    <View
      accessibilityLabel={`Grupo muscular: ${group}`}
      accessibilityRole="image"
      style={{ width: bodyWidth, height: bodyHeight, overflow: "hidden", pointerEvents: "none" }}
    >
      <Svg viewBox={viewBox} width={bodyWidth} height={bodyHeight}>
        {anatomicalBodies[side].flatMap((part, partIndex) => {
          const paths = [
            ...(part.path?.common ?? []),
            ...(part.path?.left ?? []),
            ...(part.path?.right ?? []),
          ];
          const isActive = part.slug ? activeMuscles.has(part.slug) : false;

          return paths.map((path, pathIndex) => (
            <Path
              key={`${part.slug ?? partIndex}-${pathIndex}`}
              d={path}
              fill={isActive ? colors.maroon : neutralFill}
              stroke={isActive ? colors.maroon : neutralStroke}
              strokeWidth={isActive ? 1.4 : 0.75}
              vectorEffect="non-scaling-stroke"
            />
          ));
        })}
      </Svg>
    </View>
  );
}
