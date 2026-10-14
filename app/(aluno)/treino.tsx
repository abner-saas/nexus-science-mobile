import { BlockedConsult, useStudentAccess } from "@/features/acesso/blocked-screen";
import { TreinoScreen } from "@/features/treino/treino-screen";

export default function TreinoRoute() {
  const access = useStudentAccess();
  if (access.kind === "missing") return null;
  if (access.kind === "blocked") return <BlockedConsult billing={access.billing} />;
  return <TreinoScreen studentId={access.studentId} />;
}
