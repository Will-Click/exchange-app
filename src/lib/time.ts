import { TZ } from "@/lib/constants";

/** Offset (minutes) of a timezone from UTC at a given instant. */
function offsetMinutes(at: Date, tz: string) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" })
      .formatToParts(at).map((p) => [p.type, p.value]),
  );
  const asUtc = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
  return (asUtc - at.getTime()) / 60000;
}

/** "2027-01-18" + "07:30" in the university timezone → ISO instant. */
export function zonedToIso(date: string, time: string, tz = TZ) {
  const [y, mo, d] = date.split("-").map(Number);
  const [h, mi] = (time || "00:00").split(":").map(Number);
  const guess = new Date(Date.UTC(y, mo - 1, d, h, mi));
  const off = offsetMinutes(guess, tz);
  const first = new Date(guess.getTime() - off * 60000);
  const off2 = offsetMinutes(first, tz);
  return new Date(guess.getTime() - off2 * 60000).toISOString();
}

/** ISO instant → { date: "YYYY-MM-DD", time: "HH:MM" } in the university timezone. */
export function isoToZoned(iso: string, tz = TZ) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-CA", { timeZone: tz }),
    time: d.toLocaleTimeString("en-GB", { timeZone: tz, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }),
  };
}
