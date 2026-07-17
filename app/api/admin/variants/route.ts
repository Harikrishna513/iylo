import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-admin-auth";
import { addAdminVariant } from "@/lib/admin";

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = await request.json();
  const product_id = String(body.product_id ?? "").trim();
  const name = String(body.name ?? "").trim();
  const price = Number(body.price);

  if (!product_id || !name || Number.isNaN(price)) {
    return NextResponse.json(
      { error: "product_id, name, and price are required" },
      { status: 400 }
    );
  }

  try {
    const variant = await addAdminVariant({
      product_id,
      name,
      price,
      offer_price:
        body.offer_price === "" || body.offer_price == null
          ? null
          : Number(body.offer_price),
      stock_quantity:
        body.stock_quantity !== undefined ? Number(body.stock_quantity) : 0,
      sku: body.sku ? String(body.sku) : undefined,
    });
    return NextResponse.json({ variant });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
