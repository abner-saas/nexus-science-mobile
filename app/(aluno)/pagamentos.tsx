import { PagamentosScreen } from "@/features/pagamentos/pagamentos-screen";
import { useAuthStore } from "@/store/auth";

export default function PagamentosRoute() {
  const session = useAuthStore((state) => state.session);
  if (session.status !== "member" || !session.user.studentId) return null;
  return <PagamentosScreen studentId={session.user.studentId} />;
}
