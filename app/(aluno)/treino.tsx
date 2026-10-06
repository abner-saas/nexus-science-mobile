import { TreinoScreen } from "@/features/treino/treino-screen";
import { useAuthStore } from "@/store/auth";

export default function TreinoRoute() {
  const session = useAuthStore((state) => state.session);
  if (session.status !== "member" || !session.user.studentId) return null;
  return <TreinoScreen studentId={session.user.studentId} />;
}
