import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-admin-auth";
import { createServiceClient } from "@/lib/supabase";

export async function GET() {
  const auth = await requireAdmin("superadmin");
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("admin_users")
    .select("id, user_id, role, is_active, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const admins = await Promise.all(
    (data ?? []).map(async (row) => {
      const { data: authUser } = await supabase.auth.admin.getUserById(row.user_id);
      return {
        ...row,
        email: authUser?.user?.email ?? "—",
      };
    })
  );

  return NextResponse.json({ admins });
}

export async function POST(request: Request) {
  const auth = await requireAdmin("superadmin");
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { email, role } = await request.json();
  if (!email || !role) {
    return NextResponse.json({ error: "Email and role required" }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { data: users } = await supabase.auth.admin.listUsers();
  const match = users.users.find(
    (u) => u.email?.toLowerCase() === String(email).toLowerCase()
  );

  if (!match) {
    return NextResponse.json(
      { error: "No account found with that email. User must sign up first." },
      { status: 404 }
    );
  }

  const { error } = await supabase.from("admin_users").upsert(
    {
      user_id: match.id,
      role: role === "superadmin" ? "superadmin" : "admin",
      is_active: true,
    },
    { onConflict: "user_id" }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
