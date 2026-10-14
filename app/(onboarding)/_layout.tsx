import { Redirect, Stack } from "expo-router";
import { useAuthStore } from "@/store/auth";

export default function OnboardingLayout() {
  const session = useAuthStore((state) => state.session);
  if (session.status === "loading") return null;
  if (session.status !== "lead") return <Redirect href="/" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
