/** Sticky scrollspy tabs — order matches Regular Collection sections */
export const NAV_CATEGORIES = [
  { id: "celebration-cakes", label: "Celebration Cakes" },
  { id: "viennoiserie", label: "Viennoiserie" },
  { id: "breads", label: "Breads" },
  { id: "tarts", label: "Tarts" },
  { id: "cookies", label: "Cookies" },
  { id: "custom-cakes", label: "Custom Cakes" },
  { id: "cake-slices", label: "Cake Slices" },
  { id: "gourmet-desserts", label: "Gourmet Desserts" },
] as const;

export type NavCategoryId = (typeof NAV_CATEGORIES)[number]["id"];

export const NAV_CATEGORY_ORDER: NavCategoryId[] = NAV_CATEGORIES.map((c) => c.id);

export const CATEGORY_SECTION_LABELS: Record<NavCategoryId, string> = Object.fromEntries(
  NAV_CATEGORIES.map((c) => [c.id, c.label])
) as Record<NavCategoryId, string>;
