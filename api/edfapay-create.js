import crypto from "crypto";

export const config = { api: { bodyParser: true } };

function formatPhone(phone) {
  if (!phone) return "966500000000";
  let p = String(phone).replace(/[\s\-\+\(\)]/g, "");
  if (p.startsWith("00966")) return p.slice(2);
  if (p.startsWith("966"))   return p;
  if (p.startsWith("0"))     return "966" + p.slice(1);
  if (p.startsWith("5") && p.length === 9) return "966" + p;
  return p.length >= 9 ? p : "966500000000";
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")   return res.status(405).json({ error: "Method not allowed" });

  const MERCHANT_KEY = process.env.EDFAPAY_MERCHANT_KEY;
  const PASSWORD     = process.env.EDFAPAY_PASSWORD;
  const BASE_URL     = process.env.NEXT_PUBLIC_SITE_URL || "https://fahmniplus.com";

  if (!MERCHANT_KEY || !PASSWORD) {
    return res.status(500).json({ error: "EDFAPay keys not configured" });
  }

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch {} }
  body = body || {};

  const {
    plan      = "basic",
    period    = "3m",
    userId    = null,
    userEmail = "",
    userName  = "Fahmni User",
    payer_ip  : frontendIp = null,
  } = body;

  const PRICES = { basic:{"1m":59,"3m":149}, premium:{"1m":99,"3m":249} };
  const amount = PRICES[plan]?.[period];

  // ── Validation ──
  const errors = [];
  if (!["basic","premium"].includes(plan))  errors.push("plan invalid");
  if (!["1m","3m"].includes(period))         errors.push("period invalid");
  if (!amount || amount <= 0)                errors.push("amount invalid");

  // ── Email: clean + validate + fallback ──
  const cleanEmail = (userEmail || "").trim().toLowerCase();
  const finalEmail = (cleanEmail.includes("@") && cleanEmail.includes("."))
    ? cleanEmail
    : userId
      ? `user${userId.slice(0,8)}@fahmniplus.com`
      : `guest${Date.now()}@fahmniplus.com`;

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(" | ") });
  }

  // ── Build payload ──
  const payerIp =
    frontendIp ||
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    req.headers["x-real-ip"] ||
    "178.80.69.103";

  const nameParts      = (userName || "Fahmni User").trim().split(" ");
  const firstName      = nameParts[0] || "Fahmni";
  const lastName       = nameParts.slice(1).join(" ") || "User";
  const formattedPhone = formatPhone(null);

  const orderId   = `FM${Date.now()}${userId ? userId.slice(0,4) : "0000"}`;
  const amountNum = parseFloat(amount);
  const amountStr = amountNum.toFixed(2);
  const hashInput = `${MERCHANT_KEY}${PASSWORD}${orderId}${amountStr}`;
  const hash      = crypto.createHash("md5").update(hashInput).digest("hex").toUpperCase();

  const payload = {
    merchant_key     : MERCHANT_KEY,
    order_id         : orderId,
    order_amount     : amountNum,
    order_currency   : "SAR",
    order_desc       : `Fahmni ${plan === "basic" ? "Basic" : "Premium"} Plan ${period === "1m" ? "1M" : "3M"}`,
    payer_first_name : firstName,
    payer_last_name  : lastName,
    payer_email      : finalEmail,
    payer_phone      : formattedPhone,
    payer_ip         : payerIp,
    payer_country    : "SA",
    payer_city       : "Riyadh",
    payer_address    : "Riyadh, Saudi Arabia",
    payer_zip        : "12211",
    success_url      : `${BASE_URL}/api/edfapay-callback?status=success&order_id=${orderId}&plan=${plan}&period=${period}&user_id=${userId || ""}`,
    fail_url         : `${BASE_URL}/api/edfapay-callback?status=fail&order_id=${orderId}`,
    hash,
  };

  console.log("=== EDFAPay Payload ===", JSON.stringify(payload, null, 2));

  try {
    const r = await fetch("https://api.edfapay.com/payment/initiate", {
      method : "POST",
      headers: { "Content-Type": "application/json" },
      body   : JSON.stringify(payload),
    });

    const rawText = await r.text();
    let data;
    try { data = JSON.parse(rawText); } catch { data = { raw: rawText }; }

    console.log("=== EDFAPay Response ===", r.status, JSON.stringify(data));

    if (r.ok && data.result === "SUCCESS") {
      const payUrl = data.redirect_url || data.payment_url || data.url || data.paymentUrl || data.checkout_url;
      if (!payUrl) return res.status(502).json({ error: "No payment URL returned", debug: data });

      const SB_URL = process.env.VITE_SUPABASE_URL;
      const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (SB_URL && SB_KEY && userId) {
        await fetch(`${SB_URL}/rest/v1/payment_orders`, {
          method:"POST",
          headers:{"Content-Type":"application/json","apikey":SB_KEY,"Authorization":`Bearer ${SB_KEY}`,"Prefer":"return=minimal"},
          body: JSON.stringify({ order_id:orderId, user_id:userId, plan, period, amount:amountNum, status:"pending", created_at:new Date().toISOString() }),
        }).catch(e => console.error("Supabase error:", e.message));
      }
      return res.status(200).json({ payment_url: payUrl });
    }

    const errMsg = (data.errors || []).map(e => e.error_message).join(" | ") || data.error_message || "Payment gateway error";
    console.error("EDFAPay error:", errMsg);
    return res.status(502).json({ error: errMsg, debug: data });

  } catch (e) {
    console.error("Network error:", e.message);
    return res.status(500).json({ error: "Cannot connect to payment gateway" });
  }
}
