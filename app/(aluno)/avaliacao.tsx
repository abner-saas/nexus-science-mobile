import { AvaliacaoScreen } from "@/features/avaliacao/avaliacao-screen";
import { useAuthStore } from "@/store/auth";

export default function AvaliacaoRoute() {
  const session = useAuthStore((state) => state.session);
  if (session.status !== "member" || !session.user.studentId) return null;
  return <AvaliacaoScreen studentId={session.user.studentId} />;
}
