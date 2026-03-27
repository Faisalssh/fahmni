export const config = { api: { bodyParser: true } };

export default async function handler(req, res) {
  const { status, order_id, plan, period, user_id } = req.query;

  const SUPABASE_URL     = process.env.VITE_SUPABASE_URL;
  const SUPABASE_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const BASE_URL         = process.env.NEXT_PUBLIC_SITE_URL || "https://fahmniplus.com";

  // ── نجاح الدفع ──
  if (status === "success" && user_id && plan && period) {
    try {
      // احسب تاريخ انتهاء الاشتراك
      const months      = period === "3m" ? 3 : 1;
      const expiresAt   = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + months);

      if (SUPABASE_URL && SUPABASE_SERVICE) {
        // 1) فعّل الاشتراك في profiles
        await fetch(
          `${SUPABASE_URL}/rest/v1/profiles?id=eq.${user_id}`,
          {
            method : "PATCH",
            headers: {
              "Content-Type" : "application/json",
              "apikey"       : SUPABASE_SERVICE,
              "Authorization": `Bearer ${SUPABASE_SERVICE}`,
            },
            body: JSON.stringify({
              plan             : plan,
              subscribed_until : expiresAt.toISOString(),
              updated_at       : new Date().toISOString(),
            }),
          }
        );

        // 2) حدّث حالة الطلب
        if (order_id) {
          await fetch(
            `${SUPABASE_URL}/rest/v1/payment_orders?order_id=eq.${order_id}`,
            {
              method : "PATCH",
              headers: {
                "Content-Type" : "application/json",
                "apikey"       : SUPABASE_SERVICE,
                "Authorization": `Bearer ${SUPABASE_SERVICE}`,
              },
              body: JSON.stringify({
                status    : "paid",
                paid_at   : new Date().toISOString(),
              }),
            }
          );
        }
      }

      // أعد التوجيه لصفحة النجاح
      return res.redirect(302, `${BASE_URL}/?payment=success`);

    } catch (e) {
      console.error("Callback success error:", e);
      return res.redirect(302, `${BASE_URL}/?payment=error`);
    }
  }

  // ── فشل الدفع ──
  if (order_id && SUPABASE_URL && SUPABASE_SERVICE) {
    await fetch(
      `${SUPABASE_URL}/rest/v1/payment_orders?order_id=eq.${order_id}`,
      {
        method : "PATCH",
        headers: {
          "Content-Type" : "application/json",
          "apikey"       : SUPABASE_SERVICE,
          "Authorization": `Bearer ${SUPABASE_SERVICE}`,
        },
        body: JSON.stringify({ status: "failed" }),
      }
    ).catch(() => {});
  }

  return res.redirect(302, `${BASE_URL}/?payment=fail`);
}
