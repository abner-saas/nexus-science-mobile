import { authClient } from "@/lib/auth-client";
import type { MemberUser } from "@/store/auth";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3333";

export class ApiError extends Error {
  status: number;
  code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);
  const cookie = await authClient.getCookie();
  if (cookie) headers.set("Cookie", cookie);
  if (init?.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    credentials: "omit",
  });

  if (res.status === 204) return undefined as T;

  const data = (await res.json().catch(() => ({}))) as {
    message?: string;
    error?: string;
    code?: string;
  };
  if (!res.ok) {
    throw new ApiError(res.status, data.message || data.error || "Erro na requisição", data.code);
  }
  return data as T;
}

export type Whoami =
  | { kind: "guest" }
  | { kind: "member"; user: MemberUser }
  | { kind: "lead"; name: string; email: string };

export type Plan = {
  id: string;
  name: string;
  tier: string;
  value: string;
  benefits: string[] | null;
  active: boolean;
};

export type Exercise = {
  name: string;
  group: string;
  sets: number;
  reps: string;
  load?: number;
  cadence?: string;
  rest?: string;
  technique?: string;
  notes?: string;
  /** Só aparece se o treino gravado já trouxer a URL. A biblioteca de exercícios não é juntada aqui. */
  mediaUrl?: string;
};

export type Training = {
  id: string;
  code: string;
  name: string;
  focus: string | null;
  dayOfWeek: string | null;
  duration: string | null;
  exercises: Exercise[];
};

export type Routine = {
  id: string;
  studentId: string;
  name: string;
  objective: string | null;
  frequency: number;
  status: string;
  totalSessions: number | null;
  completedSessions: number | null;
  trainings: Training[];
};

export type BioEntry = {
  id: string;
  date: string;
  energy: number | null;
  mood: number | null;
  stress: number | null;
  sleep: number | null;
  musclePain: number | null;
};

export type Payment = {
  id: string;
  amount: string;
  status: string;
  dueDate: string;
  method: string | null;
  checkoutUrl: string | null;
};

export type Assessment = {
  id: string;
  date: string;
  weight: string | null;
  bmi: string | null;
  bodyFat: string | null;
  muscle: string | null;
  photoUrls: string[] | null;
};

export type CheckoutSession = {
  studentId: string;
  paymentId: string;
  checkoutUrl: string;
  status: string;
};

export const api = {
  whoami: () => request<{ data: Whoami }>("/auth/whoami"),
  plans: () => request<{ data: Plan[] }>("/plans"),
  checkout: (planId: string) =>
    request<{ data: CheckoutSession }>("/checkout/sessions", {
      method: "POST",
      body: JSON.stringify({ planId }),
    }),
  routines: (studentId: string) =>
    request<{ data: Routine[] }>(`/routines?studentId=${studentId}`),
  completeSession: (body: { studentId: string; trainingId: string; routineId?: string; date: string }) =>
    request<{ data: unknown }>("/sessions", {
      method: "POST",
      body: JSON.stringify({ ...body, status: "COMPLETED" }),
    }),
  biofeedback: {
    list: (studentId: string) =>
      request<{ data: BioEntry[] }>(`/biofeedback?studentId=${studentId}&days=14`),
    create: (body: {
      studentId: string;
      date: string;
      energy: number;
      mood: number;
      stress: number;
      sleep: number;
      musclePain: number;
    }) => request<{ data: BioEntry }>("/biofeedback", { method: "POST", body: JSON.stringify(body) }),
  },
  payments: (studentId: string) => request<{ data: Payment[] }>(`/payments?studentId=${studentId}`),
  assessments: (studentId: string) =>
    request<{ data: Assessment[] }>(`/assessments?studentId=${studentId}`),
  pushToken: (body: { token: string; platform: "ios" | "android" }) =>
    request<{ ok: boolean }>("/me/push-token", { method: "POST", body: JSON.stringify(body) }),
};
