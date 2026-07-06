export function paymentStatusBadgeClasses(status: string): string {
  switch (status) {
    case "completed":
    case "paid":
      return "bg-emerald-500/15 text-emerald-400";
    case "processing":
    case "pending":
      return "bg-amber-500/15 text-amber-400";
    case "failed":
      return "bg-red-500/15 text-red-400";
    case "refunded":
      return "bg-ivory/10 text-muted";
    default:
      return "bg-ivory/10 text-muted";
  }
}

export function orderStatusBadgeClasses(status: string): string {
  switch (status) {
    case "delivered":
    case "picked_up":
      return "bg-emerald-500/15 text-emerald-400";
    case "confirmed":
    case "preparing":
    case "ready":
    case "out_for_delivery":
      return "bg-gold/15 text-gold";
    case "cancelled":
      return "bg-red-500/15 text-red-400";
    case "pending":
    default:
      return "bg-ivory/10 text-muted";
  }
}
