import { todayInRecife } from "@/lib/format";

const WEEKDAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;

const DAY_NAMES = ["segunda", "terca", "quarta", "quinta", "sexta", "sabado", "domingo"] as const;

export const WEEK_LABELS = ["seg", "ter", "qua", "qui", "sex", "sáb", "dom"] as const;

export function stripDiacritics(value: string): string {
  return value.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

/** 0 = segunda … 6 = domingo. `null` se o texto não for um dia. */
export function weekdayIndex(label: string | null | undefined): number | null {
  if (!label) return null;
  const name = stripDiacritics(label);
  const index = DAY_NAMES.findIndex((day) => name.startsWith(day.slice(0, 3)) || name.includes(day));
  return index === -1 ? null : index;
}

function recifeNoon(iso: string): Date {
  const [year, month, day] = iso.slice(0, 10).split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day, 15, 0, 0));
}

export function isoInRecife(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Recife",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function weekInRecife(today = todayInRecife()): { dates: string[]; todayIndex: number } {
  const noon = recifeNoon(today);
  const short = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Recife",
    weekday: "short",
  })
    .format(noon)
    .slice(0, 3) as (typeof WEEKDAY_SHORT)[number];
  const todayIndex = Math.max(0, WEEKDAY_SHORT.indexOf(short));
  const dates = Array.from({ length: 7 }, (_, index) =>
    isoInRecife(new Date(noon.getTime() + (index - todayIndex) * 86_400_000)),
  );
  return { dates, todayIndex };
}

export function dayKey(value: string): string {
  return value.slice(0, 10);
}
