import { Redirect, Stack } from "expo-router";
import { useAuthStore } from "@/store/auth";

export default function AuthLayout() {
  const session = useAuthStore((state) => state.session);
  if (session.status === "loading") return null;
  if (session.status !== "guest") return <Redirect href="/" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
