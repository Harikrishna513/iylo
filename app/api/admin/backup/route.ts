import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-admin-auth";
import { createServiceClient } from "@/lib/supabase";
import JSZip from "jszip";

const TABLES = [
  "categories",
  "products",
  "product_variants",
  "product_images",
  "users",
  "addresses",
  "carts",
  "cart_items",
  "wishlist",
  "orders",
  "order_items",
  "payment_transactions",
  "coupons",
  "delivery_zones",
  "inventory_logs",
  "admin_users",
  "site_settings",
  "announcements",
];

async function fetchAllRows(table: string) {
  const supabase = createServiceClient();
  const rows: Record<string, unknown>[] = [];
  let from = 0;
  const pageSize = 1000;

  while (true) {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .range(from, from + pageSize - 1);
    if (error) throw new Error(`${table}: ${error.message}`);
    if (!data?.length) break;
    rows.push(...data);
    if (data.length < pageSize) break;
    from += pageSize;
  }
  return rows;
}

function toCsv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((h) => {
          const val = row[h];
          const str =
            val === null || val === undefined
              ? ""
              : typeof val === "object"
                ? JSON.stringify(val)
                : String(val);
          return `"${str.replace(/"/g, '""')}"`;
        })
        .join(",")
    ),
  ];
  return lines.join("\n");
}

export async function GET() {
  const auth = await requireAdmin("superadmin");
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const zip = new JSZip();
    const manifest: string[] = [`IYLO Backup — ${new Date().toISOString()}`, ""];

    for (const table of TABLES) {
      const rows = await fetchAllRows(table);
      zip.file(`${table}.csv`, toCsv(rows));
      manifest.push(`${table}: ${rows.length} rows`);
    }

    zip.file("_manifest.txt", manifest.join("\n"));
    const buffer = await zip.generateAsync({ type: "arraybuffer" });

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="iylo-backup-${Date.now()}.zip"`,
      },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Backup failed" },
      { status: 500 }
    );
  }
}
