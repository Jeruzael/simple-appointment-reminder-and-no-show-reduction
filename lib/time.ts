import { DateTime } from "luxon";

export const BUSINESS_TIMEZONE = "Asia/Manila";
export const BUSINESS_OPEN_HOUR = 10;
export const BUSINESS_CLOSE_HOUR = 20;
export const SLOT_INCREMENT_MINUTES = 15;
export const BUFFER_MINUTES = 5;

export function parseManilaLocalToUtc(dateTimeLocal: string) {
  const manila = DateTime.fromISO(dateTimeLocal, { zone: BUSINESS_TIMEZONE });
  if (!manila.isValid) {
    return { ok: false as const, error: "Invalid date/time format." };
  }

  return { ok: true as const, manila, utc: manila.toUTC() };
}

export function isOnSlotIncrement(manila: DateTime) {
  return manila.second === 0 && manila.minute % SLOT_INCREMENT_MINUTES === 0;
}

export function isWithinBusinessHours(startManila: DateTime, endManila: DateTime) {
  const open = startManila.set({
    hour: BUSINESS_OPEN_HOUR,
    minute: 0,
    second: 0,
    millisecond: 0,
  });
  const close = startManila.set({
    hour: BUSINESS_CLOSE_HOUR,
    minute: 0,
    second: 0,
    millisecond: 0,
  });

  return startManila >= open && endManila <= close;
}
