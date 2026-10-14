export function formatBrl(value: string | number | null | undefined): string {
  const amount = typeof value === "number" ? value : Number(value ?? "");
  if (!Number.isFinite(amount)) return "—";
  return amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** Dia civil de Recife, no formato que a API espera (`YYYY-MM-DD`). */
export function todayInRecife(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Recife",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

const PAYMENT_STATUS: Record<string, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  OVERDUE: "Em atraso",
  REFUNDED: "Estornado",
  CANCELLED: "Cancelado",
};

export function paymentStatusLabel(status: string): string {
  return PAYMENT_STATUS[status] ?? status;
}

export function formatDateBr(iso: string): string {
  const [year, month, day] = iso.slice(0, 10).split("-");
  if (!year || !month || !day) return iso;
  return `${day}/${month}/${year}`;
}
