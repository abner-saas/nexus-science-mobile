import { router } from "expo-router";
import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/lib/queryClient";
import { useAuthStore } from "@/store/auth";

export async function signOutToLogin(): Promise<void> {
  try {
    await authClient.signOut();
  } finally {
    queryClient.clear();
    useAuthStore.getState().setSession({ status: "guest" });
    router.replace("/(auth)/login");
  }
}
