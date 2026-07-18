/** Shared light-page styles — mist blue background, maroon text, powder blue accents */
export const LIGHT = {
  bg: "bg-mist-blue min-h-screen",
  title: "editorial-heading text-maroon",
  heading: "text-maroon",
  subtitle: "text-sm text-maroon/55",
  label: "text-[10px] font-semibold uppercase tracking-widest text-maroon/50",
  body: "text-sm text-maroon/70",
  muted: "text-sm text-maroon/50",
  accent: "text-light-blue",
  border: "border-maroon/10",
  borderStrong: "border-maroon/15",
  card: "rounded-lg border border-maroon/10 bg-light-blue/20 shadow-sm",
  input:
    "w-full border border-maroon/15 bg-mist-blue px-4 py-3 text-sm text-maroon outline-none transition-colors focus:border-light-blue disabled:opacity-50",
  navActive: "bg-light-blue/40 text-maroon",
  navInactive: "text-maroon/65 hover:bg-light-blue/25 hover:text-maroon",
} as const;

/**
 * Standard alert colours used across the site for errors, warnings, and success.
 * Do not use brand maroon/rosewood for error text — users must notice them clearly.
 */
export const ALERT = {
  error: "text-sm text-red-600",
  errorSm: "mt-1.5 text-xs text-red-600",
  errorBox: "rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700",
  errorBorder: "border-red-500 focus:border-red-500",
  warning: "text-sm text-amber-700",
  warningSm: "text-xs text-amber-700",
  warningBox: "rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800",
  success: "text-sm text-emerald-700",
  successBox: "rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-800",
} as const;

/** Dark brand surfaces — maroon background, mist-blue text */
export const DARK = {
  bg: "bg-maroon",
  title: "editorial-heading text-mist-blue",
  heading: "text-mist-blue",
  subtitle: "text-sm text-mist-blue/70",
  muted: "text-sm text-mist-blue/55",
  accent: "text-light-blue",
  border: "border-mist-blue/15",
  card: "border border-mist-blue/15 bg-maroon",
} as const;
