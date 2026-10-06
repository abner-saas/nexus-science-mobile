import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";

export async function refreshSession(): Promise<void> {
  const { setSession } = useAuthStore.getState();
  try {
    const { data } = await api.whoami();
    if (data.kind === "member") {
      setSession({ status: "member", user: data.user });
      return;
    }
    if (data.kind === "lead") {
      setSession({ status: "lead", name: data.name, email: data.email });
      return;
    }
    setSession({ status: "guest" });
  } catch {
    setSession({ status: "guest" });
  }
}
