import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-admin-auth";
import { getAdminCategories, getAdminDashboardStats } from "@/lib/admin";

export async function GET(req: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { searchParams } = req.nextUrl;
  const dateFrom = searchParams.get("dateFrom");
  const dateTo = searchParams.get("dateTo");
  const categorySlug = searchParams.get("categorySlug");

  const [stats, categories] = await Promise.all([
    getAdminDashboardStats({
      dateFrom: dateFrom || null,
      dateTo: dateTo || null,
      categorySlug: categorySlug || null,
    }),
    getAdminCategories(),
  ]);

  return NextResponse.json({ stats, categories });
}
