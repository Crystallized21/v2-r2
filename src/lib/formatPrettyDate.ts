export function formatPrettyDate( isoDate: string ): string {
  const date = new Date(isoDate);
  const day = date.getDate();

  const suffix =
    day === 1 ? "st"
      : day === 2 ? "nd"
        : day === 3 ? "rd"
          : "th";

  const month = date.toLocaleString("en-NZ", { month: "long" });
  const year = date.getFullYear();

  return `${month} ${day}${suffix} ${year}`;
}