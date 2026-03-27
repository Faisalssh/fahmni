import crypto from "crypto";

export const config = { api: { bodyParser: true } };

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const MERCHANT_KEY = process.env.EDFAPAY_MERCHANT_KEY;
  const PASSWORD     = process.env.EDFAPAY_PASSWORD;
  const BASE_URL     = process.env.NEXT_PUBLIC_SITE_URL || "https://fahmniplus.com";

  if (!MERCHANT_KEY || !PASSWORD) {
    return res.status(500).json({ error: "مفاتيح EDFAPay غير مضبوطة" });
  }

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch {} }

  const { plan, period, userId, userEmail, userName } = body || {};

  const PRICES = {
    basic:   { "1m": 59,  "3m": 149 },
    premium: { "1m": 99,  "3m": 249 },
  };

  const amount = PRICES[plan]?.[period];
  if (!amount) return res.status(400).json({ error: "باقة أو فترة غير صالحة" });

  // توليد order_id فريد
  const orderId = `FM-${userId?.slice(0,8) || "guest"}-${Date.now()}`;

  // بناء hash — EDFAPay يستخدم MD5(MERCHANT_KEY + PASSWORD + ORDER_ID + AMOUNT)
  const hashStr  = `${MERCHANT_KEY}${PASSWORD}${orderId}${amount.toFixed(2)}`;
  const hash     = crypto.createHash("md5").update(hashStr).digest("hex").toUpperCase();

  const payload = {
    merchant_key  : MERCHANT_KEY,
    order_id      : orderId,
    order_amount  : amount.toFixed(2),
    order_currency: "SAR",
    order_desc    : `فهمني+ — باقة ${plan === "basic" ? "تأسيسي" : "احترافي"} (${period === "1m" ? "شهر" : "3 أشهر"})`,
    payer_email   : userEmail || "user@fahmniplus.com",
    payer_name    : userName  || "مستخدم فهمني+",
    payer_phone   : "0500000000",
    success_url   : `${BASE_URL}/api/edfapay-callback?status=success&order_id=${orderId}&plan=${plan}&period=${period}&user_id=${userId}`,
    fail_url      : `${BASE_URL}/api/edfapay-callback?status=fail&order_id=${orderId}`,
    hash,
  };

  try {
    const r = await fetch("https://api.edfapay.com/payment/initiate", {
      method : "POST",
      headers: { "Content-Type": "application/json" },
      body   : JSON.stringify(payload),
    });

    const data = await r.json();

    if (!r.ok || data.result !== "SUCCESS") {
      console.error("EDFAPay error:", data);
      return res.status(502).json({ error: data.message || "خطأ من بوابة الدفع" });
    }

    // احفظ الطلب في Supabase قبل الريداريكت
    const SUPABASE_URL       = process.env.VITE_SUPABASE_URL;
    const SUPABASE_SERVICE   = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (SUPABASE_URL && SUPABASE_SERVICE && userId) {
      await fetch(`${SUPABASE_URL}/rest/v1/payment_orders`, {
        method : "POST",
        headers: {
          "Content-Type" : "application/json",
          "apikey"       : SUPABASE_SERVICE,
          "Authorization": `Bearer ${SUPABASE_SERVICE}`,
          "Prefer"       : "return=minimal",
        },
        body: JSON.stringify({
          order_id : orderId,
          user_id  : userId,
          plan,
          period,
          amount,
          status   : "pending",
          created_at: new Date().toISOString(),
        }),
      }).catch(() => {});
    }

    return res.status(200).json({ payment_url: data.redirect_url });

  } catch (e) {
    console.error("EDFAPay network error:", e);
    return res.status(500).json({ error: "تعذّر الاتصال ببوابة الدفع" });
  }
}
