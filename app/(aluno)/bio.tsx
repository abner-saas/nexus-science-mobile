import { BlockedConsult, useStudentAccess } from "@/features/acesso/blocked-screen";
import { BioScreen } from "@/features/biofeedback/bio-screen";

export default function BioRoute() {
  const access = useStudentAccess();
  if (access.kind === "missing") return null;
  if (access.kind === "blocked") return <BlockedConsult billing={access.billing} />;
  return <BioScreen studentId={access.studentId} />;
}
