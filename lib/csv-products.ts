/** IYLO product CSV schema — admin-friendly (no technical fields required). */

export interface ProductCsvColumnDescriptor {
  column: string;
  required: boolean;
  description: string;
  example: string;
}

export const PRODUCT_CSV_COLUMN_DESCRIPTORS: ProductCsvColumnDescriptor[] = [
  {
    column: "name",
    required: true,
    description: "Product display name (URL is created automatically from this).",
    example: "Burnt Basque Cheesecake",
  },
  {
    column: "category",
    required: true,
    description:
      "Category name as shown in the catalogue (e.g. Celebration Cakes, Viennoiserie).",
    example: "Celebration Cakes",
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
  const cols = PRODUCT_CSV_COLUMN_DESCRIPTORS;
  const header = cols.map((d) => d.column).join(",");
  const example = cols
    .map((d) => {
      const v = d.example;
      return v.includes(",") || v.includes('"') ? `"${v.replace(/"/g, '""')}"` : v;
    })
    .join(",");
  return `${header}\n${example}\n`;
}

export function escapeCsvCell(value: string | number | boolean | null | undefined): string {
  const s = String(value ?? "");
  return s.includes(",") || s.includes('"') || s.includes("\n")
    ? `"${s.replace(/"/g, '""')}"`
    : s;
}
