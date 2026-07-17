import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-admin-auth";
import { getAdminCustomers } from "@/lib/admin";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const customers = await getAdminCustomers();
  return NextResponse.json({ customers });
}
