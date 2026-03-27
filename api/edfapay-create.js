import crypto from "crypto";

export const config = { api: { bodyParser: true } };

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")   return res.status(405).json({ error: "Method not allowed" });

  try {
    const MERCHANT_KEY = process.env.EDFAPAY_MERCHANT_KEY;
    const PASSWORD     = process.env.EDFAPAY_PASSWORD;
    const BASE_URL     = process.env.NEXT_PUBLIC_SITE_URL || "https://fahmniplus.com";

    if (!MERCHANT_KEY || !PASSWORD) {
      return res.status(500).json({ error: "EDFAPay keys not configured" });
    }

    let body = req.body;
    if (typeof body === "string") { try { body = JSON.parse(body); } catch {} }
    body = body || {};

    console.log("Request body:", JSON.stringify(body));

    const plan     = body.plan     || "basic";
    const period   = body.period   || "3m";
    const userId   = body.userId   || null;
    const userName = body.userName || "Fahmni User";
    const payer_ip = body.payer_ip || null;

    // ── إيميل المستخدم ──
    const rawEmail   = String(body.userEmail || "").trim().toLowerCase();
    const finalEmail = (rawEmail.includes("@") && rawEmail.includes("."))
      ? rawEmail
      : userId
        ? `user${String(userId).slice(0,8)}@fahmniplus.com`
        : `guest${Date.now()}@fahmniplus.com`;

    console.log("finalEmail:", finalEmail, "| rawEmail:", rawEmail);

    // ── المبلغ ──
    const PRICES = { basic:{"1m":59,"3m":149}, premium:{"1m":99,"3m":249} };
    const amount = PRICES[plan]?.[period];
    if (!amount) return res.status(400).json({ error: `Invalid plan/period: ${plan}/${period}` });

    // ── IP ──
    const payerIp =
      payer_ip ||
      (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
      req.headers["x-real-ip"] ||
      "178.80.69.103";

    // ── الاسم ──
    const parts     = userName.trim().split(" ");
    const firstName = parts[0] || "Fahmni";
    const lastName  = parts.slice(1).join(" ") || "User";

    // ── Order ──
    const orderId   = `FM${Date.now()}${userId ? String(userId).slice(0,4) : "0000"}`;
    const amountNum = parseFloat(amount);
    const amountStr = amountNum.toFixed(2);
    const hash      = crypto
      .createHash("md5")
      .update(`${MERCHANT_KEY}${PASSWORD}${orderId}${amountStr}`)
      .digest("hex")
      .toUpperCase();

    // ── Payload كامل بجميع أسماء الحقول الممكنة ──
    const payload = {
      merchant_key     : MERCHANT_KEY,
      order_id         : orderId,
      order_amount     : amountNum,
      order_currency   : "SAR",
      order_desc       : `Fahmni ${plan === "basic" ? "Basic" : "Premium"} Plan ${period === "1m" ? "1M" : "3M"}`,
      // customer info — كل الأسماء الممكنة
      payer_first_name : firstName,
      payer_last_name  : lastName,
      payer_email      : finalEmail,
      payer_phone      : "966500000000",
      payer_ip         : payerIp,
      payer_country    : "SA",
      payer_city       : "Riyadh",
      payer_address    : "Riyadh, Saudi Arabia",
      payer_zip        : "12211",
      // customer_ aliases (بعض نسخ EDFAPay تستخدمها)
      customer_email   : finalEmail,
      customer_phone   : "966500000000",
      customer_name    : `${firstName} ${lastName}`,
      // URLs
      success_url : `${BASE_URL}/api/edfapay-callback?status=success&order_id=${orderId}&plan=${plan}&period=${period}&user_id=${userId || ""}`,
      fail_url    : `${BASE_URL}/api/edfapay-callback?status=fail&order_id=${orderId}`,
      hash,
    };

    console.log("=== EDFAPay Payload ===", JSON.stringify(payload, null, 2));

    // جرّب endpoints متعددة
    const endpoints = [
      "https://api.edfapay.com/payment/initiate",
      "https://gateway.edfapay.com/payment/initiate",
      "https://checkout.edfapay.com/api/v1/payment",
    ];

    // أرسل كـ form-urlencoded أيضاً كـ fallback
    const formBody = Object.entries(payload)
      .map(([k,v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join("&");

    console.log("Trying endpoint:", endpoints[0]);
    const r = await fetch(endpoints[0], {
      method : "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body   : formBody,
    });

    const rawText = await r.text();
    let data;
    try { data = JSON.parse(rawText); } catch { data = { raw: rawText }; }

    console.log("=== EDFAPay Response ===", r.status, JSON.stringify(data));

    if (r.ok && data.result === "SUCCESS") {
      const payUrl =
        data.redirect_url  ||
        data.payment_url   ||
        data.url           ||
        data.paymentUrl    ||
        data.checkout_url;

      if (!payUrl) return res.status(502).json({ error: "No payment URL", debug: data });

      // حفظ الطلب في Supabase
      const SB_URL = process.env.VITE_SUPABASE_URL;
      const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (SB_URL && SB_KEY && userId) {
        await fetch(`${SB_URL}/rest/v1/payment_orders`, {
          method  : "POST",
          headers : { "Content-Type":"application/json","apikey":SB_KEY,"Authorization":`Bearer ${SB_KEY}`,"Prefer":"return=minimal" },
          body    : JSON.stringify({ order_id:orderId, user_id:userId, plan, period, amount:amountNum, status:"pending", created_at:new Date().toISOString() }),
        }).catch(e => console.error("Supabase error:", e.message));
      }

      return res.status(200).json({ payment_url: payUrl });
    }

    const errMsg = (data.errors || []).map(e => e.error_message).join(" | ") || data.error_message || "Gateway error";
    console.error("EDFAPay error:", errMsg, JSON.stringify(data));
    return res.status(502).json({ error: errMsg, debug: data });

  } catch (e) {
    console.error("CRASH:", e.message, e.stack);
    return res.status(500).json({ error: e.message });
  }
}
