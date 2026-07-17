import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-admin-auth";
import { buildCsvTemplate } from "@/lib/csv-products";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const csv = buildCsvTemplate();
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="iylo-product-template.csv"',
    },
  });
}
