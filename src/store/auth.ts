import { create } from "zustand";

export type BillingView = {
  status: string;
  appAccess: boolean;
  blocked: boolean;
  daysOverdue: number;
  reason: "overdue" | "paused" | "cancelled" | "pending" | null;
};

export type MemberUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "TRAINER" | "FINANCE" | "RECEPTION" | "STUDENT";
  studentId?: string | null;
  billing?: BillingView;
};

export type SessionState =
  | { status: "loading" }
  | { status: "guest" }
  | { status: "lead"; name: string; email: string }
  | { status: "member"; user: MemberUser };

type AuthStore = {
  session: SessionState;
  setSession: (session: SessionState) => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  session: { status: "loading" },
  setSession: (session) => set({ session }),
}));
