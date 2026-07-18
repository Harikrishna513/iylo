import { createServiceClient } from "@/lib/supabase";
import { escapeCsvCell } from "@/lib/csv-products";
import { slugifyProductName, uniquifySlug } from "@/lib/slug";

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

export interface AdminProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  offer_price: number | null;
  stock_quantity: number;
  low_stock_threshold: number;
  is_active: boolean;
  display_order: number;
}

export interface AdminProduct {
  id: string;
  sku: string;
  slug: string;
  name: string;
  category_id: string;
  category_name: string;
  category_slug: string;
  short_description: string;
  long_description: string | null;
  base_price: number | null;
  offer_price: number | null;
  diet_type: string;
  availability_type: string;
  is_bestseller: boolean;
  is_seasonal: boolean;
  is_new: boolean;
  is_featured: boolean;
  is_active: boolean;
  preparation_time: string | null;
  shelf_life: string | null;
  weight_label: string | null;
  display_order: number;
  stock_total: number;
  variant_count: number;
  variants: AdminProductVariant[];
}

export interface AdminProductUpdateInput {
  name?: string;
  slug?: string;
  category_id?: string;
  short_description?: string;
  long_description?: string | null;
  base_price?: number | null;
  offer_price?: number | null;
  diet_type?: string;
  availability_type?: string;
  is_bestseller?: boolean;
  is_seasonal?: boolean;
  is_new?: boolean;
  is_featured?: boolean;
  is_active?: boolean;
  preparation_time?: string | null;
  shelf_life?: string | null;
  weight_label?: string | null;
  display_order?: number;
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
    .gt("stock_quantity", 0);

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
    .filter((v) => {
      const threshold = Number(v.low_stock_threshold ?? 5);
      return v.stock_quantity > 0 && v.stock_quantity <= threshold;
    })
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

function mapAdminProduct(p: Record<string, unknown>): AdminProduct {
  const category = p.categories as { id?: string; name?: string; slug?: string } | null;
  const variantsRaw =
    (p.product_variants as Array<{
      id: string;
      name: string;
      sku: string;
      price: number;
      offer_price: number | null;
      stock_quantity: number;
      low_stock_threshold: number;
      is_active: boolean;
      display_order: number;
    }>) ?? [];
  const variants = [...variantsRaw].sort((a, b) => a.display_order - b.display_order);
  return {
    id: p.id as string,
    sku: (p.sku as string) ?? "",
    slug: p.slug as string,
    name: p.name as string,
    category_id: (p.category_id as string) ?? category?.id ?? "",
    category_name: category?.name ?? "",
    category_slug: category?.slug ?? "",
    short_description: (p.short_description as string) ?? "",
    long_description: (p.long_description as string | null) ?? null,
    base_price: p.base_price != null ? Number(p.base_price) : null,
    offer_price: p.offer_price != null ? Number(p.offer_price) : null,
    diet_type: (p.diet_type as string) ?? "eggless",
    availability_type: (p.availability_type as string) ?? "daily",
    is_bestseller: Boolean(p.is_bestseller),
    is_seasonal: Boolean(p.is_seasonal),
    is_new: Boolean(p.is_new),
    is_featured: Boolean(p.is_featured),
    is_active: Boolean(p.is_active),
    preparation_time: (p.preparation_time as string | null) ?? null,
    shelf_life: (p.shelf_life as string | null) ?? null,
    weight_label: (p.weight_label as string | null) ?? null,
    display_order: Number(p.display_order ?? 0),
    stock_total: variants.reduce((s, v) => s + Number(v.stock_quantity), 0),
    variant_count: variants.length,
    variants: variants.map((v) => ({
      id: v.id,
      name: v.name,
      sku: v.sku,
      price: Number(v.price),
      offer_price: v.offer_price != null ? Number(v.offer_price) : null,
      stock_quantity: Number(v.stock_quantity),
      low_stock_threshold: Number(v.low_stock_threshold ?? 5),
      is_active: Boolean(v.is_active),
      display_order: Number(v.display_order ?? 0),
    })),
  };
}

const ADMIN_PRODUCT_SELECT = `
  id, sku, slug, name, category_id, short_description, long_description,
  base_price, offer_price, diet_type, availability_type,
  is_bestseller, is_seasonal, is_new, is_featured, is_active,
  preparation_time, shelf_life, weight_label, display_order,
  categories(id, name, slug),
  product_variants(id, name, sku, price, offer_price, stock_quantity, low_stock_threshold, is_active, display_order)
`;

export async function getAdminProducts(): Promise<AdminProduct[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("products")
    .select(ADMIN_PRODUCT_SELECT)
    .order("display_order", { ascending: true });

  return (data ?? []).map((p) => mapAdminProduct(p as Record<string, unknown>));
}

export async function getAdminProductById(id: string): Promise<AdminProduct | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("products")
    .select(ADMIN_PRODUCT_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  return mapAdminProduct(data as Record<string, unknown>);
}

export async function updateAdminProduct(
  productId: string,
  input: AdminProductUpdateInput
): Promise<AdminProduct> {
  const supabase = createServiceClient();
  const updates: Record<string, unknown> = {};

  if (input.name !== undefined) updates.name = input.name.trim();
  if (input.slug !== undefined) {
    const base = slugifyProductName(input.slug) || "product";
    const { data: others } = await supabase
      .from("products")
      .select("slug")
      .neq("id", productId);
    const used = new Set((others ?? []).map((p) => p.slug as string));
    updates.slug = uniquifySlug(base, used);
  }
  if (input.category_id !== undefined) updates.category_id = input.category_id;
  if (input.short_description !== undefined) {
    updates.short_description = input.short_description.trim();
  }
  if (input.long_description !== undefined) {
    updates.long_description = input.long_description?.trim() || null;
  }
  if (input.base_price !== undefined) updates.base_price = input.base_price;
  if (input.offer_price !== undefined) updates.offer_price = input.offer_price;
  if (input.diet_type !== undefined) updates.diet_type = input.diet_type;
  if (input.availability_type !== undefined) {
    updates.availability_type = input.availability_type;
  }
  if (input.is_bestseller !== undefined) updates.is_bestseller = input.is_bestseller;
  if (input.is_seasonal !== undefined) updates.is_seasonal = input.is_seasonal;
  if (input.is_new !== undefined) updates.is_new = input.is_new;
  if (input.is_featured !== undefined) updates.is_featured = input.is_featured;
  if (input.is_active !== undefined) updates.is_active = input.is_active;
  if (input.preparation_time !== undefined) {
    updates.preparation_time = input.preparation_time?.trim() || null;
  }
  if (input.shelf_life !== undefined) {
    updates.shelf_life = input.shelf_life?.trim() || null;
  }
  if (input.weight_label !== undefined) {
    updates.weight_label = input.weight_label?.trim() || null;
  }
  if (input.display_order !== undefined) updates.display_order = input.display_order;

  if (Object.keys(updates).length === 0) {
    const existing = await getAdminProductById(productId);
    if (!existing) throw new Error("Product not found");
    return existing;
  }

  const { error } = await supabase.from("products").update(updates).eq("id", productId);
  if (error) throw new Error(error.message);

  const updated = await getAdminProductById(productId);
  if (!updated) throw new Error("Product not found after update");
  return updated;
}

export async function updateAdminVariant(
  variantId: string,
  input: {
    name?: string;
    price?: number;
    offer_price?: number | null;
    stock_quantity?: number;
    low_stock_threshold?: number;
    is_active?: boolean;
  },
  opts?: { adminUserId?: string | null }
) {
  const supabase = createServiceClient();

  let previousStock: number | null = null;
  if (input.stock_quantity !== undefined) {
    const { data: current } = await supabase
      .from("product_variants")
      .select("stock_quantity")
      .eq("id", variantId)
      .maybeSingle();
    previousStock = current?.stock_quantity ?? null;
  }

  const updates: Record<string, unknown> = {};
  if (input.name !== undefined) updates.name = input.name.trim();
  if (input.price !== undefined) updates.price = input.price;
  if (input.offer_price !== undefined) updates.offer_price = input.offer_price;
  if (input.stock_quantity !== undefined) updates.stock_quantity = input.stock_quantity;
  if (input.low_stock_threshold !== undefined) {
    updates.low_stock_threshold = input.low_stock_threshold;
  }
  if (input.is_active !== undefined) updates.is_active = input.is_active;

  const { error } = await supabase
    .from("product_variants")
    .update(updates)
    .eq("id", variantId);
  if (error) throw new Error(error.message);

  if (
    input.stock_quantity !== undefined &&
    previousStock !== null &&
    previousStock !== input.stock_quantity
  ) {
    const { logAdminStockAdjustment } = await import("@/lib/inventory");
    await logAdminStockAdjustment(supabase, {
      variantId,
      previousQty: previousStock,
      nextQty: input.stock_quantity,
      adminUserId: opts?.adminUserId,
    });
  }
}

export async function addAdminVariant(input: {
  product_id: string;
  name: string;
  price: number;
  offer_price?: number | null;
  stock_quantity?: number;
  sku?: string;
}) {
  const supabase = createServiceClient();
  const sku =
    input.sku?.trim() ||
    `IYLO-V-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

  const { data, error } = await supabase
    .from("product_variants")
    .insert({
      product_id: input.product_id,
      name: input.name.trim(),
      sku,
      price: input.price,
      offer_price: input.offer_price ?? null,
      stock_quantity: input.stock_quantity ?? 0,
      is_active: true,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteAdminVariant(variantId: string) {
  const supabase = createServiceClient();
  const { error } = await supabase.from("product_variants").delete().eq("id", variantId);
  if (error) throw new Error(error.message);
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
       categories(slug, name)`
    )
    .order("display_order", { ascending: true });

  const header =
    "name,category,short_description,base_price,is_active,display_order,slug,sku";
  const lines = (data ?? []).map((p) => {
    const cat = p.categories as unknown as { slug: string; name: string } | null;
    return [
      escapeCsvCell(p.name),
      escapeCsvCell(cat?.name || cat?.slug || ""),
      escapeCsvCell(p.short_description ?? ""),
      escapeCsvCell(p.base_price ?? ""),
      escapeCsvCell(p.is_active),
      escapeCsvCell(p.display_order),
      escapeCsvCell(p.slug),
      escapeCsvCell(p.sku),
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
