import { BioScreen } from "@/features/biofeedback/bio-screen";
import { useAuthStore } from "@/store/auth";

export default function BioRoute() {
  const session = useAuthStore((state) => state.session);
  if (session.status !== "member" || !session.user.studentId) return null;
  return <BioScreen studentId={session.user.studentId} />;
}
