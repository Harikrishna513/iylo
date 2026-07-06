import { NextRequest, NextResponse } from "next/server";
import { createInquiry, type InquiryType } from "@/lib/inquiries";
import { validateIndianPhone } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const inquiryType = body.inquiry_type as InquiryType;
    if (inquiryType !== "corporate" && inquiryType !== "custom") {
      return NextResponse.json({ error: "Invalid enquiry type" }, { status: 400 });
    }

    const contactName = String(body.contact_name ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const message = String(body.message ?? "").trim();
    const phone = validateIndianPhone(String(body.phone ?? ""));

    if (!contactName) {
      return NextResponse.json({ error: "Contact name is required" }, { status: 400 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }
    if (!phone) {
      return NextResponse.json({ error: "Valid Indian phone number is required" }, { status: 400 });
    }
    if (!message) {
      return NextResponse.json({ error: "Please describe your requirements" }, { status: 400 });
    }

    if (inquiryType === "corporate" && !String(body.company_name ?? "").trim()) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 });
    }

    const row = await createInquiry({
      inquiry_type: inquiryType,
      contact_name: contactName,
      company_name: String(body.company_name ?? "").trim() || undefined,
      phone,
      email,
      message,
      gst_required: Boolean(String(body.gst ?? "").trim()),
      estimated_qty: String(body.event_size ?? body.estimated_qty ?? "").trim() || undefined,
      delivery_date: String(body.delivery_date ?? "").trim() || null,
      budget: String(body.budget ?? "").trim() || null,
    });

    return NextResponse.json({ success: true, id: row.id });
  } catch (err) {
    console.error("Inquiry submit error:", err);
    return NextResponse.json({ error: "Failed to submit enquiry" }, { status: 500 });
  }
}
