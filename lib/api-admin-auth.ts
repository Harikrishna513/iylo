import { createServerSupabase } from "@/lib/supabase-server";
import { createServiceClient } from "@/lib/supabase";

export async function requireAdmin(required?: "superadmin") {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized", status: 401 as const, user: null };
  }

  const service = createServiceClient();
  const { data: admin } = await service
    .from("admin_users")
    .select("role, is_active")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (!admin) {
    return { error: "Forbidden", status: 403 as const, user: null };
  }

  if (required === "superadmin" && admin.role !== "superadmin") {
    return { error: "Superadmin required", status: 403 as const, user: null };
  }

  return { error: null, status: 200 as const, user, role: admin.role };
}
