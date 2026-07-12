import type { Product, ProductVariant } from "@/types";

/** Infer selectable variants from catalog / legacy product data */
export function inferProductVariants(product: Product): ProductVariant[] {
  if (product.variants?.length) return product.variants;

  const ld = product.longDescription?.toLowerCase() ?? "";

  if (
    product.category === "celebration-cakes" ||
    ld.includes("0.5kg") ||
    ld.includes("0.5 kg")
  ) {
    return [
      { id: `${product.id}-0-5kg`, name: "0.5 kg", price: 0 },
      { id: `${product.id}-1kg`, name: "1 kg", price: 0 },
      { id: `${product.id}-2kg`, name: "2 kg", price: 0 },
    ];
  }

  if (ld.includes("pack of 21")) {
    return [
      { id: `${product.id}-individual`, name: "Individual", price: product.price },
      { id: `${product.id}-pack-10`, name: "Pack of 10", price: 0 },
      { id: `${product.id}-pack-21`, name: "Pack of 21", price: 0 },
    ];
  }

  if (ld.includes("pack of 10")) {
    return [
      { id: `${product.id}-individual`, name: "Individual", price: product.price },
      { id: `${product.id}-pack-10`, name: "Pack of 10", price: 0 },
      { id: `${product.id}-pack-20`, name: "Pack of 20", price: 0 },
    ];
  }

  if (product.price > 0) {
    return [{ id: `${product.id}-1pc`, name: "1 pc", price: product.price }];
  }

  return [{ id: `${product.id}-standard`, name: "Standard", price: product.price }];
}

export function mapDbVariants(
  rows: Array<{
    id: string;
    name: string;
    price: number;
    offer_price: number | null;
    is_active: boolean;
  }>
): ProductVariant[] {
  return rows
    .filter((v) => v.is_active)
    .map((v) => ({
      id: v.id,
      name: v.name,
      price: Number(v.offer_price ?? v.price),
      offerPrice: v.offer_price ? Number(v.offer_price) : undefined,
    }));
}

export function productRequiresPreOrder(product: Product): boolean {
  if (product.isPreOrder) return true;
  return product.category === "celebration-cakes";
}
