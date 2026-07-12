import nodemailer from "nodemailer";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  ADMIN_EMAIL,
  BRAND_NAME,
  EMAIL_FROM_HEADER,
  SITE_URL,
  SUPPORT_EMAIL,
} from "@/lib/config";
import { BRAND_COLORS } from "@/data/site-content";

const PALETTE = {
  ivory: "#faf6f0",
  cream: "#f2eae2",
  gold: BRAND_COLORS.lightBlue,
  brown: BRAND_COLORS.maroon,
  muted: "#9b8e87",
} as const;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

async function getOrderEmailData(supabase: SupabaseClient, orderId: string) {
  const { data: order } = await supabase
    .from("orders")
    .select(
      "order_number, guest_name, guest_email, guest_phone, subtotal, delivery_fee, discount_amount, gift_wrap_fee, total_amount, address_snapshot, fulfillment_type, scheduled_date, scheduled_slot_label, user_id"
    )
    .eq("id", orderId)
    .single();

  if (!order) throw new Error("Order not found");

  let customerEmail = order.guest_email;
  let customerName = order.guest_name ?? "Customer";

  if (order.user_id) {
    const { data: profile } = await supabase
      .from("users")
      .select("name")
      .eq("id", order.user_id)
      .maybeSingle();
    if (profile?.name) customerName = profile.name;
  }

  const { data: items } = await supabase
    .from("order_items")
    .select("product_name, variant_name, quantity, unit_price, line_total")
    .eq("order_id", orderId);

  const addr = order.address_snapshot as {
    line1?: string;
    line2?: string;
    city?: string;
    pincode?: string;
  } | null;

  const addressStr = addr
    ? [addr.line1, addr.line2, addr.city, addr.pincode].filter(Boolean).join(", ")
    : "Pickup at store";

  return {
    customerName,
    customerEmail: customerEmail ?? "",
    orderNumber: order.order_number,
    items: (items ?? []).map((i) => ({
      name: i.product_name,
      variant: i.variant_name ?? "",
      quantity: i.quantity,
      price: Number(i.unit_price),
    })),
    subtotal: Number(order.subtotal),
    deliveryFee: Number(order.delivery_fee),
    discount: Number(order.discount_amount),
    giftWrapFee: Number(order.gift_wrap_fee),
    total: Number(order.total_amount),
    address: addressStr,
    fulfillment: order.fulfillment_type,
    scheduledDate: order.scheduled_date,
    scheduledSlot: order.scheduled_slot_label,
  };
}

function orderItemsHtml(
  items: Array<{ name: string; variant: string; quantity: number; price: number }>
) {
  return items
    .map(
      (item) => `
    <tr>
      <td style="padding:10px;border-bottom:1px solid ${PALETTE.cream};">
        <strong>${item.name}</strong>
        ${item.variant ? `<br><span style="font-size:12px;color:${PALETTE.muted}">${item.variant}</span>` : ""}
      </td>
      <td style="padding:10px;border-bottom:1px solid ${PALETTE.cream};text-align:center;">${item.quantity}</td>
      <td style="padding:10px;border-bottom:1px solid ${PALETTE.cream};text-align:right;">₹${(item.price * item.quantity).toFixed(0)}</td>
    </tr>`
    )
    .join("");
}

function baseTemplate(content: string) {
  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:${PALETTE.ivory};font-family:Georgia,serif;color:${PALETTE.brown};">
  <div style="max-width:600px;margin:0 auto;padding:24px;">
    <div style="text-align:center;padding:24px;background:${PALETTE.cream};border-radius:12px 12px 0 0;">
      <h1 style="margin:0;color:${PALETTE.brown};font-size:28px;">${BRAND_NAME}</h1>
      <p style="margin:4px 0 0;font-size:12px;letter-spacing:2px;color:${PALETTE.muted};">Modern Baking, Made Eggless</p>
    </div>
    <div style="background:white;padding:28px;border-radius:0 0 12px 12px;">${content}</div>
    <p style="text-align:center;font-size:11px;color:${PALETTE.muted};margin-top:16px;">
      <a href="${SITE_URL}" style="color:${PALETTE.gold};">${SITE_URL}</a>
    </p>
  </div></body></html>`;
}

export async function sendOrderEmails(
  supabase: SupabaseClient,
  orderId: string
) {
  const data = await getOrderEmailData(supabase, orderId);
  if (!data.customerEmail) return;

  const customerHtml = baseTemplate(`
    <h2 style="color:${PALETTE.brown};">Thank you, ${data.customerName}!</h2>
    <p>Your order <strong>${data.orderNumber}</strong> has been confirmed.</p>
    <table style="width:100%;border-collapse:collapse;margin:20px 0;">
      <thead><tr style="background:${PALETTE.cream};">
        <th style="padding:10px;text-align:left;">Item</th>
        <th style="padding:10px;">Qty</th>
        <th style="padding:10px;text-align:right;">Amount</th>
      </tr></thead>
      <tbody>${orderItemsHtml(data.items)}</tbody>
    </table>
    <p><strong>Subtotal:</strong> ₹${data.subtotal.toFixed(0)}</p>
    ${data.deliveryFee > 0 ? `<p><strong>Delivery:</strong> ₹${data.deliveryFee.toFixed(0)}</p>` : ""}
    ${data.discount > 0 ? `<p><strong>Discount:</strong> -₹${data.discount.toFixed(0)}</p>` : ""}
    <p style="font-size:18px;"><strong>Total: ₹${data.total.toFixed(0)}</strong></p>
    <p><strong>${data.fulfillment === "pickup" ? "Pickup" : "Delivery"}:</strong> ${data.address}</p>
    ${data.scheduledDate ? `<p><strong>Scheduled:</strong> ${data.scheduledDate} ${data.scheduledSlot ?? ""}</p>` : ""}
    <p style="margin-top:24px;">We'll notify you when your order is ready. Questions? Reply to this email.</p>
  `);

  await transporter.sendMail({
    from: EMAIL_FROM_HEADER,
    to: data.customerEmail,
    subject: `Order Confirmed — ${data.orderNumber} | ${BRAND_NAME}`,
    html: customerHtml,
  });

  const adminHtml = baseTemplate(`
    <h2 style="color:${PALETTE.brown};">New Order — ${data.orderNumber}</h2>
    <p><strong>Customer:</strong> ${data.customerName} (${data.customerEmail})</p>
    <p><strong>Total:</strong> ₹${data.total.toFixed(0)}</p>
    <p><strong>Fulfillment:</strong> ${data.fulfillment}</p>
    <p><strong>Address:</strong> ${data.address}</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      <tbody>${orderItemsHtml(data.items)}</tbody>
    </table>
    <p><a href="${SITE_URL}/admin/orders" style="color:${PALETTE.gold};">View in admin →</a></p>
  `);

  await transporter.sendMail({
    from: EMAIL_FROM_HEADER,
    to: ADMIN_EMAIL,
    subject: `New Order ${data.orderNumber} — ₹${data.total.toFixed(0)}`,
    html: adminHtml,
  });
}

export async function sendOrderStatusEmail(
  supabase: SupabaseClient,
  orderId: string,
  status: string
) {
  const data = await getOrderEmailData(supabase, orderId);
  if (!data.customerEmail) return;

  const statusLabels: Record<string, string> = {
    preparing: "being prepared",
    ready: "ready for pickup",
    out_for_delivery: "out for delivery",
    delivered: "delivered",
    picked_up: "picked up",
    cancelled: "cancelled",
  };

  const label = statusLabels[status] ?? status;

  await transporter.sendMail({
    from: EMAIL_FROM_HEADER,
    to: data.customerEmail,
    subject: `Order ${data.orderNumber} — ${label}`,
    html: baseTemplate(`
      <h2>Hi ${data.customerName},</h2>
      <p>Your order <strong>${data.orderNumber}</strong> is now <strong>${label}</strong>.</p>
      <p><a href="${SITE_URL}/account/orders" style="color:${PALETTE.gold};">Track your order →</a></p>
    `),
  });
}

export { SUPPORT_EMAIL };
