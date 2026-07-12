import { createServiceClient } from "@/lib/supabase";

export interface AdminDashboardStats {
  todayOrders: number;
  weekRevenue: number;
  monthRevenue: number;
  totalCustomers: number;
  pendingOrders: number;
  lowStockCount: number;
  outOfStockCount: number;
  activeProducts: number;
  totalProducts: number;
  inactiveProducts: number;
  recentOrders: AdminOrder[];
  lowStockItems: Array<{ name: string; variant: string; stock: number }>;
  outOfStockItems: Array<{ name: string; variant: string; stock: number }>;
  avgOrderValue: number;
}

export interface AdminUserRow {
  id: string;
  user_id: string;
  email: string;
  role: "admin" | "superadmin";
  is_active: boolean;
  created_at: string;
}

export interface AdminOrder {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  guest_name: string | null;
  guest_email: string | null;
  fulfillment_type: string;
  placed_at: string;
  payment_status: string;
}

export interface AdminCustomer {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  order_count: number;
  total_spent: number;
  created_at: string;
}

export interface AdminProduct {
  id: string;
  slug: string;
  name: string;
  base_price: number | null;
  is_active: boolean;
  category_name: string;
  stock_total: number;
  variant_count: number;
}

const revenueStatuses = ["confirmed", "preparing", "ready", "out_for_delivery", "delivered", "picked_up"];

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const supabase = createServiceClient();
  const today = new Date().toISOString().split("T")[0];

  const { count: todayOrders } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .gte("placed_at", `${today}T00:00:00`);

  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();
  const monthAgo = new Date(Date.now() - 30 * 86400000).toISOString();

  const { data: weekOrders } = await supabase
    .from("orders")
    .select("total_amount, status")
    .gte("placed_at", weekAgo)
    .in("status", revenueStatuses);

  const { data: monthOrders } = await supabase
    .from("orders")
    .select("total_amount, status")
    .gte("placed_at", monthAgo)
    .in("status", revenueStatuses);

  const { count: totalCustomers } = await supabase
    .from("users")
    .select("id", { count: "exact", head: true });

  const { count: pendingOrders } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("status", "pending");

  const { data: recentOrders } = await supabase
    .from("orders")
    .select("id, order_number, status, total_amount, guest_name, guest_email, fulfillment_type, placed_at")
    .order("placed_at", { ascending: false })
    .limit(10);

  const recentWithPayment = await Promise.all(
    (recentOrders ?? []).map(async (o) => {
      const { data: txn } = await supabase
        .from("payment_transactions")
        .select("status")
        .eq("order_id", o.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      return {
        ...o,
        payment_status: txn?.status ?? "pending",
      } as AdminOrder;
    })
  );

  const { data: variants } = await supabase
    .from("product_variants")
    .select("name, stock_quantity, low_stock_threshold, products(name)")
    .eq("is_active", true)
    .lte("stock_quantity", 5);

  const { data: outOfStockVariants } = await supabase
    .from("product_variants")
    .select("name, stock_quantity, products(name)")
    .eq("is_active", true)
    .eq("stock_quantity", 0);

  const { count: activeProducts } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("is_active", true);

  const { count: totalProducts } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true });

  const lowStockItems = (variants ?? []).map((v) => ({
    name: (v.products as unknown as { name: string }).name,
    variant: v.name,
    stock: v.stock_quantity,
  }));

  const outOfStockItems = (outOfStockVariants ?? []).map((v) => ({
    name: (v.products as unknown as { name: string }).name,
    variant: v.name,
    stock: v.stock_quantity,
  }));

  const avgOrderValue =
    recentWithPayment.length > 0
      ? recentWithPayment.reduce((s, o) => s + Number(o.total_amount), 0) /
        recentWithPayment.length
      : 0;

  return {
    todayOrders: todayOrders ?? 0,
    weekRevenue: (weekOrders ?? []).reduce((s, o) => s + Number(o.total_amount), 0),
    monthRevenue: (monthOrders ?? []).reduce((s, o) => s + Number(o.total_amount), 0),
    totalCustomers: totalCustomers ?? 0,
    pendingOrders: pendingOrders ?? 0,
    lowStockCount: lowStockItems.length,
    outOfStockCount: outOfStockItems.length,
    activeProducts: activeProducts ?? 0,
    totalProducts: totalProducts ?? 0,
    inactiveProducts: (totalProducts ?? 0) - (activeProducts ?? 0),
    recentOrders: recentWithPayment,
    lowStockItems: lowStockItems.slice(0, 10),
    outOfStockItems: outOfStockItems.slice(0, 10),
    avgOrderValue,
  };
}

export async function getAdminOrders(opts?: {
  status?: string;
  search?: string;
  limit?: number;
}): Promise<AdminOrder[]> {
  const supabase = createServiceClient();
  let query = supabase
    .from("orders")
    .select("id, order_number, status, total_amount, guest_name, guest_email, fulfillment_type, placed_at")
    .order("placed_at", { ascending: false })
    .limit(opts?.limit ?? 100);

  if (opts?.status && opts.status !== "all") {
    query = query.eq("status", opts.status);
  }

  const { data } = await query;
  const orders = data ?? [];

  if (opts?.search) {
    const q = opts.search.toLowerCase();
    return orders
      .filter(
        (o) =>
          o.order_number?.toLowerCase().includes(q) ||
          o.guest_name?.toLowerCase().includes(q) ||
          o.guest_email?.toLowerCase().includes(q)
      )
      .map((o) => ({ ...o, payment_status: "pending" })) as AdminOrder[];
  }

  return Promise.all(
    orders.map(async (o) => {
      const { data: txn } = await supabase
        .from("payment_transactions")
        .select("status")
        .eq("order_id", o.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      return { ...o, payment_status: txn?.status ?? "pending" } as AdminOrder;
    })
  );
}

export async function updateOrderStatus(
  orderId: string,
  status: string,
  reason?: string
) {
  const supabase = createServiceClient();
  const update: Record<string, unknown> = { status };
  if (status === "cancelled") {
    update.cancelled_at = new Date().toISOString();
    update.cancellation_reason = reason ?? null;
  }
  if (status === "delivered" || status === "picked_up") {
    update.delivered_at = new Date().toISOString();
  }
  const { error } = await supabase.from("orders").update(update).eq("id", orderId);
  if (error) throw error;
}

export async function getAdminCustomers(): Promise<AdminCustomer[]> {
  const supabase = createServiceClient();
  const { data: profiles } = await supabase
    .from("users")
    .select("id, name, phone, created_at")
    .order("created_at", { ascending: false });

  const customers: AdminCustomer[] = [];

  for (const p of profiles ?? []) {
    const { data: authUser } = await supabase.auth.admin.getUserById(p.id);
    const { data: orders } = await supabase
      .from("orders")
      .select("total_amount, status")
      .eq("user_id", p.id)
      .in("status", revenueStatuses);

    customers.push({
      id: p.id,
      full_name: p.name,
      email: authUser?.user?.email ?? "",
      phone: p.phone,
      order_count: orders?.length ?? 0,
      total_spent: (orders ?? []).reduce((s, o) => s + Number(o.total_amount), 0),
      created_at: p.created_at,
    });
  }

  return customers;
}

export async function getAdminProducts(): Promise<AdminProduct[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("products")
    .select(
      `id, slug, name, base_price, is_active,
       categories(name),
       product_variants(stock_quantity)`
    )
    .order("display_order", { ascending: true });

  return (data ?? []).map((p) => {
    const variants = (p.product_variants as Array<{ stock_quantity: number }>) ?? [];
    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      base_price: p.base_price,
      is_active: p.is_active,
      category_name: (p.categories as unknown as { name: string } | null)?.name ?? "",
      stock_total: variants.reduce((s, v) => s + v.stock_quantity, 0),
      variant_count: variants.length,
    };
  });
}

export async function getCurrentAdminRole(
  userId: string
): Promise<"admin" | "superadmin" | null> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("admin_users")
    .select("role")
    .eq("user_id", userId)
    .eq("is_active", true)
    .maybeSingle();
  return (data?.role as "admin" | "superadmin") ?? null;
}

export async function getAdminUsers(): Promise<AdminUserRow[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("admin_users")
    .select("id, user_id, role, is_active, created_at")
    .order("created_at", { ascending: true });

  const rows: AdminUserRow[] = [];
  for (const row of data ?? []) {
    const { data: authUser } = await supabase.auth.admin.getUserById(row.user_id);
    rows.push({
      id: row.id,
      user_id: row.user_id,
      email: authUser?.user?.email ?? "—",
      role: row.role as "admin" | "superadmin",
      is_active: row.is_active,
      created_at: row.created_at,
    });
  }
  return rows;
}

export async function exportProductsCsv(): Promise<string> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("products")
    .select(
      `slug, name, short_description, base_price, is_active, display_order,
       categories(slug)`
    )
    .order("display_order", { ascending: true });

  const header =
    "slug,name,category_slug,base_price,short_description,is_active,display_order";
  const lines = (data ?? []).map((p) => {
    const cat = (p.categories as unknown as { slug: string } | null)?.slug ?? "";
    const esc = (v: string | number | boolean | null) => {
      const s = String(v ?? "");
      return s.includes(",") || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
    };
    return [
      esc(p.slug),
      esc(p.name),
      esc(cat),
      esc(p.base_price ?? 0),
      esc(p.short_description ?? ""),
      esc(p.is_active),
      esc(p.display_order),
    ].join(",");
  });
  return [header, ...lines].join("\n");
}
