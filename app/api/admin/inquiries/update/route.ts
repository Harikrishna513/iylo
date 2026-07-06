import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-admin-auth";
import { updateInquiry, type InquiryStatus } from "@/lib/inquiries";

const VALID_STATUSES: InquiryStatus[] = ["new", "contacted", "quoted", "closed"];

export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = await req.json();
  const id = String(body.id ?? "");
  if (!id) {
    return NextResponse.json({ error: "Inquiry id required" }, { status: 400 });
  }

  const update: { status?: InquiryStatus; admin_notes?: string | null } = {};
  if (body.status !== undefined) {
    if (!VALID_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    update.status = body.status;
  }
  if (body.admin_notes !== undefined) {
    update.admin_notes = body.admin_notes ? String(body.admin_notes) : null;
  }

  if (!Object.keys(update).length) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  await updateInquiry(id, update);
  return NextResponse.json({ success: true });
}
