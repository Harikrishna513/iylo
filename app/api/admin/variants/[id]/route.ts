import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api-admin-auth";
import { deleteAdminVariant, updateAdminVariant } from "@/lib/admin";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;
  const body = await request.json();

  try {
    await updateAdminVariant(
      id,
      {
        name: body.name !== undefined ? String(body.name) : undefined,
        price: body.price !== undefined ? Number(body.price) : undefined,
        offer_price:
          body.offer_price === undefined
            ? undefined
            : body.offer_price === "" || body.offer_price === null
              ? null
              : Number(body.offer_price),
        stock_quantity:
          body.stock_quantity !== undefined ? Number(body.stock_quantity) : undefined,
        low_stock_threshold:
          body.low_stock_threshold !== undefined
            ? Number(body.low_stock_threshold)
            : undefined,
        is_active: body.is_active !== undefined ? Boolean(body.is_active) : undefined,
      },
      { adminUserId: auth.user?.id }
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;
  try {
    await deleteAdminVariant(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 });
  }
}
