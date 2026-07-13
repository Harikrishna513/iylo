/** Shared light-page styles — cream background, maroon text, powder blue accents */
export const LIGHT = {
  bg: "bg-cream min-h-screen",
  title: "editorial-heading text-maroon",
  heading: "text-maroon",
  subtitle: "text-sm text-maroon/55",
  label: "text-[10px] font-semibold uppercase tracking-widest text-maroon/50",
  body: "text-sm text-maroon/70",
  muted: "text-sm text-maroon/50",
  accent: "text-light-blue",
  border: "border-maroon/10",
  borderStrong: "border-maroon/15",
  card: "rounded-lg border border-maroon/10 bg-white shadow-sm",
  input:
    "w-full border border-maroon/15 bg-white px-4 py-3 text-sm text-maroon outline-none transition-colors focus:border-light-blue disabled:opacity-50",
  navActive: "bg-mist-blue text-maroon",
  navInactive: "text-maroon/65 hover:bg-mist-blue/60 hover:text-maroon",
} as const;
