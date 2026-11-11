function getOrdinalSuffix( day: number ): string {
  // 11th, 12th, 13th break the usual rule
  if (day >= 11 && day <= 13) {
    return "th";
  }

  const lastDigit = day % 10;

  if (lastDigit === 1) return "st";
  if (lastDigit === 2) return "nd";
  if (lastDigit === 3) return "rd";

  return "th";
}

// event_date is a plain date ("2026-03-14"), which JS reads as UTC midnight.
// Reading it back in UTC stops it showing the day before on machines behind UTC.
export function formatPrettyDate( isoDate: string ): string {
  const date = new Date(isoDate);
  const day = date.getUTCDate();

  const month = date.toLocaleString("en-NZ", { month: "long", timeZone: "UTC" });
  const year = date.getUTCFullYear();

  return `${month} ${day}${getOrdinalSuffix(day)} ${year}`;
}
