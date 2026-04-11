/**
 * Bloques horarios del laboratorio (igual que centromundox).
 * 6 bloques de 1h 45min, lunes a viernes.
 */
export const TIME_BLOCKS = [
  "07:00-08:45",
  "08:45-10:30",
  "10:30-12:15",
  "12:15-14:00",
  "14:00-15:45",
  "15:45-17:30",
] as const;

export type TimeBlock = (typeof TIME_BLOCKS)[number];
