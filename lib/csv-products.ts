/** IYLO product CSV schema — one row per product (variants optional in future). */

export interface ProductCsvColumnDescriptor {
  column: string;
  required: boolean;
  description: string;
  example: string;
}

export const PRODUCT_CSV_COLUMN_DESCRIPTORS: ProductCsvColumnDescriptor[] = [
  {
    column: "slug",
    required: true,
    description: "URL-safe unique product slug. Used to match existing products on import.",
    example: "burnt-basque-cheesecake",
  },
  {
    column: "name",
    required: true,
    description: "Product display name.",
    example: "Burnt Basque Cheesecake",
  },
  {
    column: "category_slug",
    required: true,
    description: "Must match an existing category slug in the catalogue.",
    example: "celebration-cakes",
  },
  {
    column: "sku",
    required: false,
    description: "Unique stock-keeping unit. Auto-generated from slug if blank on create.",
    example: "IYLO-BBC-001",
  },
  {
    column: "short_description",
    required: false,
    description: "Short blurb shown on cards and product teasers.",
    example: "Creamy eggless burnt basque with a caramelised top.",
  },
  {
    column: "base_price",
    required: false,
    description: "Base price in INR (number). Leave blank if priced only via variants.",
    example: "899",
  },
  {
    column: "is_active",
    required: false,
    description: "true / false. Defaults to true. false hides the product from the store.",
    example: "true",
  },
  {
    column: "display_order",
    required: false,
    description: "Sort order (integer). Lower numbers appear first.",
    example: "10",
  },
];

export function buildCsvTemplate(): string {
  const header = PRODUCT_CSV_COLUMN_DESCRIPTORS.map((d) => d.column).join(",");
  const example = PRODUCT_CSV_COLUMN_DESCRIPTORS.map((d) => {
    const v = d.example;
    return v.includes(",") || v.includes('"') ? `"${v.replace(/"/g, '""')}"` : v;
  }).join(",");
  return `${header}\n${example}\n`;
}

export function escapeCsvCell(value: string | number | boolean | null | undefined): string {
  const s = String(value ?? "");
  return s.includes(",") || s.includes('"') || s.includes("\n")
    ? `"${s.replace(/"/g, '""')}"`
    : s;
}
