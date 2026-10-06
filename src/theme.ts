import { Platform } from "react-native";

export const colors = {
  navy: "#002060",
  maroon: "#800000",
  background: "#f4f5f7",
  input: "#f1f3f6",
  card: "#ffffff",
  line: "#e3e6ea",
  lineLight: "#edeff2",
  ink: "#1a1f2b",
  muted: "#6b7280",
  success: "#10b981",
  danger: "#dc2626",
  warning: "#d97706",
  white: "#ffffff",
};

export const space = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
};

export const radius = {
  input: 11,
  button: 12,
  card: 16,
  panel: 22,
  pill: 999,
} as const;

export const shadow = {
  card: Platform.select({
    web: { boxShadow: "0 5px 14px rgba(16,24,40,0.07)" },
    default: {
      shadowColor: "#101828",
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.07,
      shadowRadius: 14,
      elevation: 2,
    },
  }),
  nav: Platform.select({
    web: { boxShadow: "0 -4px 12px rgba(0,32,96,0.10)" },
    default: {
      shadowColor: colors.navy,
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 8,
    },
  }),
  button: Platform.select({
    web: { boxShadow: "0 3px 7px rgba(0,32,96,0.20)" },
    default: {
      shadowColor: colors.navy,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 7,
      elevation: 2,
    },
  }),
} as const;

export const font = {
  display: "BebasNeue_400Regular",
  title: "Montserrat_700Bold",
  titleSoft: "Montserrat_600SemiBold",
  body: "DMSans_400Regular",
  bodyMedium: "DMSans_500Medium",
  bodyBold: "DMSans_700Bold",
} as const;
