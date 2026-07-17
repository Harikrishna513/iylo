export type DashboardPreset =
  | "today"
  | "week"
  | "month"
  | "year"
  | "all"
  | "custom";

export interface DashboardDateRange {
  dateFrom: string | null;
  dateTo: string | null;
}

export interface DashboardPresetSpec {
  value: DashboardPreset;
  label: string;
  shortLabel: string;
}

export const DASHBOARD_PRESETS: ReadonlyArray<DashboardPresetSpec> = Object.freeze([
  Object.freeze({ value: "today", label: "Today", shortLabel: "Today" }),
  Object.freeze({ value: "week", label: "This Week", shortLabel: "Week" }),
  Object.freeze({ value: "month", label: "This Month", shortLabel: "Month" }),
  Object.freeze({ value: "year", label: "This Year", shortLabel: "Year" }),
  Object.freeze({ value: "all", label: "All Time", shortLabel: "All" }),
  Object.freeze({ value: "custom", label: "Custom Range", shortLabel: "Custom" }),
] as const);

export function dateRangeForPreset(
  preset: DashboardPreset,
  now: Date = new Date()
): DashboardDateRange {
  if (preset === "all" || preset === "custom") {
    return { dateFrom: null, dateTo: null };
  }

  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const tomorrow = new Date(startOfDay);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (preset === "today") {
    return {
      dateFrom: startOfDay.toISOString(),
      dateTo: tomorrow.toISOString(),
    };
  }

  if (preset === "week") {
    const monAnchored = (startOfDay.getDay() + 6) % 7;
    const weekStart = new Date(startOfDay);
    weekStart.setDate(weekStart.getDate() - monAnchored);
    return {
      dateFrom: weekStart.toISOString(),
      dateTo: tomorrow.toISOString(),
    };
  }

  if (preset === "month") {
    const monthStart = new Date(startOfDay.getFullYear(), startOfDay.getMonth(), 1);
    return {
      dateFrom: monthStart.toISOString(),
      dateTo: tomorrow.toISOString(),
    };
  }

  if (preset === "year") {
    const yearStart = new Date(startOfDay.getFullYear(), 0, 1);
    return {
      dateFrom: yearStart.toISOString(),
      dateTo: tomorrow.toISOString(),
    };
  }

  return { dateFrom: null, dateTo: null };
}

export function localDateToIsoStart(value: string | null | undefined): string | null {
  if (!value) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const [, yyyy, mm, dd] = m;
  const d = new Date(Number(yyyy), Number(mm) - 1, Number(dd), 0, 0, 0, 0);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

export function localDateToIsoEndExclusive(
  value: string | null | undefined
): string | null {
  const start = localDateToIsoStart(value);
  if (!start) return null;
  const d = new Date(start);
  d.setDate(d.getDate() + 1);
  return d.toISOString();
}

export function isoToLocalDateInput(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear().toString().padStart(4, "0");
  const mm = (d.getMonth() + 1).toString().padStart(2, "0");
  const dd = d.getDate().toString().padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function describeDateRange(
  range: DashboardDateRange,
  now: Date = new Date(),
  locale: string = "en-IN"
): string {
  if (!range.dateFrom && !range.dateTo) return "All time";

  const fmt = new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    year:
      range.dateFrom && new Date(range.dateFrom).getFullYear() === now.getFullYear()
        ? undefined
        : "numeric",
  });

  const fromLabel = range.dateFrom ? fmt.format(new Date(range.dateFrom)) : "…";

  let toLabel = "…";
  if (range.dateTo) {
    const inclusiveEnd = new Date(range.dateTo);
    inclusiveEnd.setDate(inclusiveEnd.getDate() - 1);
    toLabel = fmt.format(inclusiveEnd);
  }

  if (fromLabel === toLabel) return fromLabel;
  return `${fromLabel} – ${toLabel}`;
}
