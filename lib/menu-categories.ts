import type { Product } from "@/types";
import {
  NAV_CATEGORIES,
  type NavCategoryId,
} from "@/data/nav-categories";

/** Map sticky-nav ids → product category slug(s) in DB / catalog */
export const MENU_CATEGORY_SLUGS: Record<NavCategoryId, readonly string[]> = {
  "celebration-cakes": ["celebration-cakes", "cakes"],
  viennoiserie: ["viennoiserie", "pastries"],
  breads: ["breads"],
  tarts: ["tarts", "retail"],
  cookies: ["cookies"],
  "custom-cakes": ["custom-cakes"],
  "cake-slices": ["cake-slices"],
  "gourmet-desserts": ["gourmet-desserts", "cheesecakes", "desserts"],
};

export type MenuCategoryGroup = {
  id: NavCategoryId;
  label: string;
  products: Product[];
};

export function groupProductsByMenuCategory(
  products: Product[]
): MenuCategoryGroup[] {
  const used = new Set<string>();

  return NAV_CATEGORIES.map((cat) => {
    const slugs = MENU_CATEGORY_SLUGS[cat.id];
    const groupProducts = products.filter((p) => {
      if (!slugs.includes(p.category) || used.has(p.id)) return false;
      used.add(p.id);
      return true;
    });
    return {
      id: cat.id,
      label: cat.label,
      products: groupProducts,
    };
  }).filter((g) => g.products.length > 0);
}
