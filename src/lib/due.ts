import { todayInRecife } from "@/lib/format";

/** Marcos da régua, do mais cedo ao dia seguinte ao vencimento. */
export const DUE_MARKS = [
  { id: "D-7", daysUntil: 7 },
  { id: "D-3", daysUntil: 3 },
  { id: "D-0", daysUntil: 0 },
  { id: "D+1", daysUntil: -1 },
] as const;

/** Dias até `dueDate` no calendário de Recife. Positivo = ainda não venceu. */
export function daysUntilDue(dueDate: string, today = todayInRecife()): number {
  const [y1, m1, d1] = today.slice(0, 10).split("-").map(Number);
  const [y2, m2, d2] = dueDate.slice(0, 10).split("-").map(Number);
  const from = Date.UTC(y1, m1 - 1, d1);
  const to = Date.UTC(y2, m2 - 1, d2);
  return Math.round((to - from) / 86_400_000);
}

/**
 * 0 no D-7, 1 no D+1. Os quatro marcos ficam espaçados por igual;
 * o marcador interpola entre os dois marcos vizinhos.
 */
export function dueMarkerPosition(daysUntil: number): number {
  const marks = DUE_MARKS.map((mark) => mark.daysUntil);
  if (daysUntil >= marks[0]) return 0;
  if (daysUntil <= marks[marks.length - 1]) return 1;

  for (let index = 0; index < marks.length - 1; index += 1) {
    const start = marks[index];
    const end = marks[index + 1];
    if (daysUntil <= start && daysUntil >= end) {
      const span = start - end;
      const traveled = (start - daysUntil) / span;
      const slot = 1 / (marks.length - 1);
      return index * slot + traveled * slot;
    }
  }
  return 1;
}
