import { create } from "zustand";

export type MemberUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "TRAINER" | "FINANCE" | "RECEPTION" | "STUDENT";
  studentId?: string | null;
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
