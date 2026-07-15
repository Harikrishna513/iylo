/** Homepage category grid — order matches public/category/ assets */
export const CATEGORY_CARDS = [
  {
    id: "celebration-cakes",
    label: "Celebration Cakes",
    image: "/category/celebration-cakes.webp",
    href: "/products#category-celebration-cakes",
    productCategory: "celebration-cakes",
  },
  {
    id: "cookies",
    label: "Cookies",
    image: "/category/cookies.webp",
    href: "/products#category-cookies",
    productCategory: "cookies",
  },
  {
    id: "breads",
    label: "Breads",
    image: "/category/breads.webp",
    href: "/products#category-breads",
    productCategory: "breads",
  },
  {
    id: "custom-cakes",
    label: "Custom Cakes",
    image: "/category/custom-cakes.webp",
    href: "/products#category-celebration-cakes",
    productCategory: "celebration-cakes",
  },
  {
    id: "viennoiserie",
    label: "Viennoiserie",
    image: "/category/viennoiserie.webp",
    href: "/products#category-viennoiserie",
    productCategory: "viennoiserie",
  },
  {
    id: "tarts",
    label: "Tarts",
    image: "/category/tarts.webp",
    href: "/products#category-tarts",
    productCategory: "tarts",
  },
  {
    id: "gourmet-desserts",
    label: "Gourmet Desserts",
    image: "/category/gourmet-desserts.webp",
    href: "/products#category-gourmet-desserts",
    productCategory: "cheesecakes",
  },
  {
    id: "gifting",
    label: "Gifting",
    image: "/category/gifting.webp",
    href: "/#gifting",
    productCategory: null,
  },
] as const;

export type CategoryCardId = (typeof CATEGORY_CARDS)[number]["id"];

export const CATEGORY_CARD_LABELS: Record<CategoryCardId, string> = Object.fromEntries(
  CATEGORY_CARDS.map((c) => [c.id, c.label])
) as Record<CategoryCardId, string>;

export function getCategoryCard(slug: string) {
  return CATEGORY_CARDS.find((c) => c.id === slug);
}

export const BROWSABLE_CATEGORY_CARDS = CATEGORY_CARDS.filter(
  (c) => c.productCategory !== null
);
