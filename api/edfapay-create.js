import crypto from "crypto";

export const config = { api: { bodyParser: true } };

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const MERCHANT_KEY = process.env.EDFAPAY_MERCHANT_KEY;
    const PASSWORD     = process.env.EDFAPAY_PASSWORD;
    const BASE_URL     = process.env.NEXT_PUBLIC_SITE_URL || "https://fahmniplus.com";

    if (!MERCHANT_KEY || !PASSWORD) {
      return res.status(500).json({ error: "Keys missing" });
    }

    let body = req.body;
    if (typeof body === "string") { try { body = JSON.parse(body); } catch {} }
    body = body || {};

    const plan   = body.plan   || "basic";
    const period = body.period || "3m";
    const userId = body.userId || null;
    const email  = body.userEmail || `user${Date.now()}@fahmniplus.com`;
    const ip     = body.payer_ip  ||
                   (req.headers["x-forwarded-for"]||"").split(",")[0].trim() ||
                   "178.80.69.103";

    const PRICES = { basic:{"1m":59,"3m":149,"1y":399}, premium:{"1m":59,"3m":149,"1y":399} };
    const amount = PRICES[plan]?.[period];
    if (!amount) return res.status(400).json({ error: "Invalid plan/period" });

    const orderId = `FM${Date.now()}`;
    const hash    = crypto
      .createHash("md5")
      .update(`${MERCHANT_KEY}${PASSWORD}${orderId}${amount.toFixed(2)}`)
      .digest("hex")
      .toUpperCase();

    // Payload بجميع الأسماء الممكنة لكل حقل
    const payload = {
      merchant_key     : MERCHANT_KEY,
      order_id         : orderId,
      order_amount     : amount,
      order_currency   : "SAR",
      order_desc       : "Subscription",

      // اسم — كل الأسماء الممكنة
      payer_first_name : "Faisal",
      payer_last_name  : "Alshehri",
      first_name       : "Faisal",
      last_name        : "Alshehri",
      customer_name    : "Faisal Alshehri",
      billing_name     : "Faisal Alshehri",

      // إيميل — كل الأسماء الممكنة
      payer_email      : email,
      customer_email   : email,
      email            : email,
      billing_email    : email,

      // جوال — كل الأسماء الممكنة
      payer_phone      : "966560263364",
      customer_phone   : "966560263364",
      phone            : "966560263364",
      billing_phone    : "966560263364",
      mobile           : "966560263364",

      // IP — كل الأسماء الممكنة
      payer_ip         : ip,
      customer_ip      : ip,
      ip_address       : ip,

      // عنوان
      payer_country    : "SA",
      payer_city       : "Riyadh",
      payer_address    : "Riyadh",
      payer_zip        : "12211",
      billing_country  : "SA",

      // URLs
      success_url : `${BASE_URL}/api/edfapay-callback?status=success&order_id=${orderId}&plan=${plan}&period=${period}&user_id=${userId||""}`,
      fail_url    : `${BASE_URL}/api/edfapay-callback?status=fail&order_id=${orderId}`,
      hash,
    };

    console.log("Payload:", JSON.stringify(payload, null, 2));

    const r = await fetch("https://api.edfapay.com/payment/initiate", {
      method : "POST",
      headers: { "Content-Type": "application/json" },
      body   : JSON.stringify(payload),
    });

    const rawText = await r.text();
    let data;
    try { data = JSON.parse(rawText); } catch { data = { raw: rawText }; }

    console.log("Response:", r.status, JSON.stringify(data));

    if (r.ok && data.result === "SUCCESS") {
      const payUrl = data.redirect_url || data.payment_url || data.url || data.paymentUrl || data.checkout_url;
      if (!payUrl) return res.status(502).json({ error: "No payment URL", debug: data });

      // حفظ في Supabase
      const SB_URL = process.env.VITE_SUPABASE_URL;
      const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (SB_URL && SB_KEY && userId) {
        await fetch(`${SB_URL}/rest/v1/payment_orders`, {
          method  : "POST",
          headers : { "Content-Type":"application/json","apikey":SB_KEY,"Authorization":`Bearer ${SB_KEY}`,"Prefer":"return=minimal" },
          body    : JSON.stringify({ order_id:orderId, user_id:userId, plan, period, amount, status:"pending", created_at:new Date().toISOString() }),
        }).catch(e => console.error("Supabase:", e.message));
      }

      return res.status(200).json({ payment_url: payUrl });
    }

    const errMsg = (data.errors||[]).map(e=>e.error_message).join(" | ") || data.error_message || "Error";
    console.error("EDFAPay error:", errMsg);
    return res.status(502).json({ error: errMsg, debug: data });

  } catch (e) {
    console.error("CRASH:", e.message, e.stack);
    return res.status(500).json({ error: e.message });
  }
}
