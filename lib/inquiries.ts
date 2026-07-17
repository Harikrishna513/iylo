import { createServiceClient } from "@/lib/supabase";

export type InquiryType = "corporate" | "custom";
export type InquiryStatus = "new" | "contacted" | "quoted" | "closed";

export interface InquiryPayload {
  inquiry_type: InquiryType;
  contact_name: string;
  company_name?: string;
  phone: string;
  email?: string;
  message: string;
  gst_required?: boolean;
  estimated_qty?: string;
  delivery_date?: string | null;
  budget?: string | null;
}

export interface AdminInquiry {
  id: string;
  inquiry_type: InquiryType;
  contact_name: string;
  company_name: string | null;
  phone: string;
  email: string;
  message: string | null;
  gst_required: boolean;
  estimated_qty: string | null;
  delivery_date: string | null;
  budget: string | null;
  status: InquiryStatus;
  admin_notes: string | null;
  created_at: string;
}

export async function createInquiry(payload: InquiryPayload) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("corporate_inquiries")
    .insert({
      inquiry_type: payload.inquiry_type,
      contact_name: payload.contact_name,
      company_name: payload.company_name || null,
      phone: payload.phone,
      email: (payload.email?.trim().toLowerCase() || "not-provided@iylobakehouse.com"),
      message: payload.message,
      gst_required: payload.gst_required ?? false,
      estimated_qty: payload.estimated_qty || null,
      delivery_date: payload.delivery_date || null,
      budget: payload.budget || null,
      status: "new",
    })
    .select("id")
    .single();

  if (error) throw error;
  return data;
}

export async function getAdminInquiries(opts?: {
  status?: string;
  type?: string;
}): Promise<AdminInquiry[]> {
  const supabase = createServiceClient();
  let query = supabase
    .from("corporate_inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (opts?.status && opts.status !== "all") {
    query = query.eq("status", opts.status);
  }
  if (opts?.type && opts.type !== "all") {
    query = query.eq("inquiry_type", opts.type);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as AdminInquiry[];
}

export async function updateInquiry(
  id: string,
  update: { status?: InquiryStatus; admin_notes?: string | null }
) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("corporate_inquiries").update(update).eq("id", id);
  if (error) throw error;
}
