import { BlockedConsult, useStudentAccess } from "@/features/acesso/blocked-screen";
import { AvaliacaoScreen } from "@/features/avaliacao/avaliacao-screen";

export default function AvaliacaoRoute() {
  const access = useStudentAccess();
  if (access.kind === "missing") return null;
  if (access.kind === "blocked") return <BlockedConsult billing={access.billing} />;
  return <AvaliacaoScreen studentId={access.studentId} />;
}
