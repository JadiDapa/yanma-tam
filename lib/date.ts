// Pad number/string to 2 digits
// 1  -> "01"
// 10 -> "10"

export function pad2(value: string | number): string {
  return String(value).padStart(2, "0");
}

// Convert year + month into "YYYY-MM"
export function toYearMonth(
  year: string | number,
  month: string | number,
): string {
  return `${year}-${pad2(month)}`;
}

// Get current year & month
export function currentYearMonth() {
  const now = new Date();
  return {
    year: String(now.getFullYear()),
    month: pad2(now.getMonth() + 1),
  };
}

// Build a Date range for a given "YYYY-MM"
// Used for Prisma date filtering
export function monthRange(yearMonth: string) {
  const [y, m] = yearMonth.split("-").map(Number);

  const start = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0));
  const next = new Date(Date.UTC(y, m, 1, 0, 0, 0));

  return { start, next };
}

// Generate selectable years (ex: last N years)
export function yearOptions(count = 5): string[] {
  const current = new Date().getFullYear();
  return Array.from({ length: count }, (_, i) => String(current - i));
}

// Month options for dropdowns
export const monthOptions = [
  { value: "01", label: "Jan" },
  { value: "02", label: "Feb" },
  { value: "03", label: "Mar" },
  { value: "04", label: "Apr" },
  { value: "05", label: "May" },
  { value: "06", label: "Jun" },
  { value: "07", label: "Jul" },
  { value: "08", label: "Aug" },
  { value: "09", label: "Sep" },
  { value: "10", label: "Oct" },
  { value: "11", label: "Nov" },
  { value: "12", label: "Dec" },
];

export function formatDate(d: Date) {
  return d.toLocaleDateString("id-ID", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
