import { createServiceClient } from "@/lib/supabase";
import { escapeCsvCell } from "@/lib/csv-products";

export interface DashboardFilters {
  dateFrom?: string | null;
  dateTo?: string | null;
  categorySlug?: string | null;
}

export interface AdminDashboardStats {
  filteredRevenue: number;
  filteredOrderCount: number;
  filteredAvgOrderValue: number;
  pendingOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalCustomers: number;
  lowStockCount: number;
  outOfStockCount: number;
  activeProducts: number;
  totalProducts: number;
  inactiveProducts: number;
  recentOrders: AdminOrder[];
  lowStockItems: Array<{ name: string; variant: string; stock: number }>;
  outOfStockItems: Array<{ name: string; variant: string; stock: number }>;
}

export interface AdminCategoryRow {
  id: string;
  slug: string;
  name: string;
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
  is_active: boolean;
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

const revenueStatuses = [
  "confirmed",
  "preparing",
  "ready",
  "out_for_delivery",
  "delivered",
  "picked_up",
];

function applyDateFilter<T extends { gte: (c: string, v: string) => T; lt: (c: string, v: string) => T }>(
  query: T,
  filters: DashboardFilters | undefined,
  column = "placed_at"
): T {
  let q = query;
  if (filters?.dateFrom) q = q.gte(column, filters.dateFrom);
  if (filters?.dateTo) q = q.lt(column, filters.dateTo);
  return q;
}

export async function getAdminCategories(): Promise<AdminCategoryRow[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("categories")
    .select("id, slug, name")
    .eq("is_active", true)
    .order("display_order", { ascending: true });
  return (data ?? []) as AdminCategoryRow[];
}

export async function getAdminDashboardStats(
  filters: DashboardFilters = {}
): Promise<AdminDashboardStats> {
  const supabase = createServiceClient();

  let ordersQuery = supabase
    .from("orders")
    .select("id, order_number, status, total_amount, guest_name, guest_email, fulfillment_type, placed_at");
  ordersQuery = applyDateFilter(ordersQuery as never, filters) as typeof ordersQuery;

  const { data: periodOrders } = await ordersQuery.order("placed_at", { ascending: false });

  const orders = periodOrders ?? [];
  const revenueOrders = orders.filter((o) => revenueStatuses.includes(o.status));
  const filteredRevenue = revenueOrders.reduce((s, o) => s + Number(o.total_amount), 0);
  const filteredOrderCount = orders.length;
  const filteredAvgOrderValue =
    revenueOrders.length > 0 ? filteredRevenue / revenueOrders.length : 0;

  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const deliveredOrders = orders.filter(
    (o) => o.status === "delivered" || o.status === "picked_up"
  ).length;
  const cancelledOrders = orders.filter((o) => o.status === "cancelled").length;

  const recentSlice = orders.slice(0, 10);
  const recentWithPayment = await Promise.all(
    recentSlice.map(async (o) => {
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

  const { count: totalCustomers } = await supabase
    .from("users")
    .select("id", { count: "exact", head: true });

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

  const lowStockItems = (variants ?? [])
    .filter((v) => v.stock_quantity > 0)
    .map((v) => ({
      name: (v.products as unknown as { name: string }).name,
      variant: v.name,
      stock: v.stock_quantity,
    }));

  const outOfStockItems = (outOfStockVariants ?? []).map((v) => ({
    name: (v.products as unknown as { name: string }).name,
    variant: v.name,
    stock: v.stock_quantity,
  }));

  return {
    filteredRevenue,
    filteredOrderCount,
    filteredAvgOrderValue,
    pendingOrders,
    deliveredOrders,
    cancelledOrders,
    totalCustomers: totalCustomers ?? 0,
    lowStockCount: lowStockItems.length,
    outOfStockCount: outOfStockItems.length,
    activeProducts: activeProducts ?? 0,
    totalProducts: totalProducts ?? 0,
    inactiveProducts: (totalProducts ?? 0) - (activeProducts ?? 0),
    recentOrders: recentWithPayment,
    lowStockItems: lowStockItems.slice(0, 10),
    outOfStockItems: outOfStockItems.slice(0, 10),
  };
}

export async function getAdminOrders(opts?: {
  status?: string;
  search?: string;
  dateFrom?: string | null;
  dateTo?: string | null;
  limit?: number;
}): Promise<AdminOrder[]> {
  const supabase = createServiceClient();
  let query = supabase
    .from("orders")
    .select(
      "id, order_number, status, total_amount, guest_name, guest_email, fulfillment_type, placed_at"
    )
    .order("placed_at", { ascending: false })
    .limit(opts?.limit ?? 200);

  if (opts?.status && opts.status !== "all") {
    query = query.eq("status", opts.status);
  }
  if (opts?.dateFrom) query = query.gte("placed_at", opts.dateFrom);
  if (opts?.dateTo) query = query.lt("placed_at", opts.dateTo);

  const { data } = await query;
  let orders = data ?? [];

  if (opts?.search) {
    const q = opts.search.toLowerCase();
    orders = orders.filter(
      (o) =>
        o.order_number?.toLowerCase().includes(q) ||
        o.guest_name?.toLowerCase().includes(q) ||
        o.guest_email?.toLowerCase().includes(q)
    );
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
    .select("id, name, phone, email, created_at")
    .order("created_at", { ascending: false });

  const customers: AdminCustomer[] = [];

  for (const p of profiles ?? []) {
    let email = (p as { email?: string | null }).email ?? "";
    if (!email) {
      const { data: authUser } = await supabase.auth.admin.getUserById(p.id);
      email = authUser?.user?.email ?? "";
    }

    const { data: orders } = await supabase
      .from("orders")
      .select("total_amount, status")
      .eq("user_id", p.id)
      .in("status", revenueStatuses);

    customers.push({
      id: p.id,
      full_name: p.name,
      email,
      phone: p.phone,
      order_count: orders?.length ?? 0,
      total_spent: (orders ?? []).reduce((s, o) => s + Number(o.total_amount), 0),
      created_at: p.created_at,
      is_active: true,
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
      `sku, slug, name, short_description, base_price, is_active, display_order,
       categories(slug)`
    )
    .order("display_order", { ascending: true });

  const header =
    "slug,name,category_slug,sku,short_description,base_price,is_active,display_order";
  const lines = (data ?? []).map((p) => {
    const cat = (p.categories as unknown as { slug: string } | null)?.slug ?? "";
    return [
      escapeCsvCell(p.slug),
      escapeCsvCell(p.name),
      escapeCsvCell(cat),
      escapeCsvCell(p.sku),
      escapeCsvCell(p.short_description ?? ""),
      escapeCsvCell(p.base_price ?? ""),
      escapeCsvCell(p.is_active),
      escapeCsvCell(p.display_order),
    ].join(",");
  });
  return [header, ...lines].join("\n");
}

export async function createAdminProduct(input: {
  name: string;
  slug: string;
  category_id: string;
  short_description?: string;
  base_price?: number | null;
  sku?: string;
  is_active?: boolean;
}): Promise<{ id: string }> {
  const supabase = createServiceClient();
  const sku =
    input.sku?.trim() ||
    `IYLO-${input.slug.toUpperCase().replace(/[^A-Z0-9]+/g, "-").slice(0, 24)}-${Date.now().toString(36).toUpperCase()}`;

  const { data, error } = await supabase
    .from("products")
    .insert({
      name: input.name.trim(),
      slug: input.slug.trim().toLowerCase(),
      sku,
      category_id: input.category_id,
      short_description: input.short_description?.trim() || input.name.trim(),
      base_price: input.base_price ?? null,
      is_active: input.is_active ?? true,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return { id: data.id };
}
