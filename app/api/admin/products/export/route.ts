import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-admin-auth";
import { exportProductsCsv } from "@/lib/admin";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const csv = await exportProductsCsv();
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="iylo-products-${Date.now()}.csv"`,
    },
  });
}
