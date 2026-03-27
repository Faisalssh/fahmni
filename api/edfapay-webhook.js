import crypto from "crypto";

export const config = { api: { bodyParser: true } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const MERCHANT_KEY     = process.env.EDFAPAY_MERCHANT_KEY;
  const PASSWORD         = process.env.EDFAPAY_PASSWORD;
  const SUPABASE_URL     = process.env.VITE_SUPABASE_URL;
  const SUPABASE_SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch {} }

  const { order_id, status, amount, hash: receivedHash } = body || {};

  // ── التحقق من التوقيع ──
  const expectedHash = crypto
    .createHash("md5")
    .update(`${MERCHANT_KEY}${PASSWORD}${order_id}${parseFloat(amount).toFixed(2)}`)
    .digest("hex")
    .toUpperCase();

  if (receivedHash && receivedHash.toUpperCase() !== expectedHash) {
    console.warn("EDFAPay webhook: invalid hash for order", order_id);
    return res.status(403).json({ error: "invalid signature" });
  }

  if (!order_id || !SUPABASE_URL || !SUPABASE_SERVICE) {
    return res.status(400).json({ error: "missing data" });
  }

  try {
    // جلب الطلب من DB
    const orderRes = await fetch(
      `${SUPABASE_URL}/rest/v1/payment_orders?order_id=eq.${order_id}&select=user_id,plan,period`,
      {
        headers: {
          "apikey"       : SUPABASE_SERVICE,
          "Authorization": `Bearer ${SUPABASE_SERVICE}`,
        },
      }
    );
    const orders = await orderRes.json();
    const order  = orders?.[0];

    if (!order) {
      console.warn("Webhook: order not found:", order_id);
      return res.status(404).json({ error: "order not found" });
    }

    if (status === "SUCCESS" || status === "APPROVED") {
      const months    = order.period === "3m" ? 3 : 1;
      const expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + months);

      // فعّل الاشتراك
      await fetch(
        `${SUPABASE_URL}/rest/v1/profiles?id=eq.${order.user_id}`,
        {
          method : "PATCH",
          headers: {
            "Content-Type" : "application/json",
            "apikey"       : SUPABASE_SERVICE,
            "Authorization": `Bearer ${SUPABASE_SERVICE}`,
          },
          body: JSON.stringify({
            plan            : order.plan,
            subscribed_until: expiresAt.toISOString(),
            updated_at      : new Date().toISOString(),
          }),
        }
      );

      // حدّث حالة الطلب
      await fetch(
        `${SUPABASE_URL}/rest/v1/payment_orders?order_id=eq.${order_id}`,
        {
          method : "PATCH",
          headers: {
            "Content-Type" : "application/json",
            "apikey"       : SUPABASE_SERVICE,
            "Authorization": `Bearer ${SUPABASE_SERVICE}`,
          },
          body: JSON.stringify({ status: "paid", paid_at: new Date().toISOString() }),
        }
      );

      console.log(`✅ Webhook: subscription activated for user ${order.user_id}`);
    } else {
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
      );
    }

    return res.status(200).json({ received: true });

  } catch (e) {
    console.error("Webhook error:", e);
    return res.status(500).json({ error: e.message });
  }
}
