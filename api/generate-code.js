import crypto from "crypto";

export const config = { api: { bodyParser: true } };

const ADMIN_EMAIL = "sirfaisalalshehri@gmail.com";

function generateCode() {
  // XXXX-XXXX-XXXX-XXXX
  return Array.from({length:4}, () =>
    crypto.randomBytes(2).toString("hex").toUpperCase()
  ).join("-");
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const SB_URL = process.env.VITE_SUPABASE_URL;
  const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SB_URL || !SB_KEY) return res.status(500).json({ error: "Server config missing" });

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch {} }
  body = body || {};

  const { plan = "basic", period = "3m", count = 1, note = "", adminEmail } = body;

  // تحقق من الأدمن
  if (adminEmail !== ADMIN_EMAIL) {
    return res.status(403).json({ error: "غير مصرح" });
  }

  const MONTHS = { "1m":1, "3m":3, "6m":6 };
  const months = MONTHS[period];
  if (!months) return res.status(400).json({ error: "period invalid" });
  if (!["basic","premium"].includes(plan)) return res.status(400).json({ error: "plan invalid" });
  if (count < 1 || count > 100) return res.status(400).json({ error: "count 1-100" });

  const codes = [];
  for (let i = 0; i < count; i++) {
    codes.push({
      code     : generateCode(),
      plan, period, months,
      used     : false,
      note     : note || `سلة - ${plan} - ${period}`,
      created_by: adminEmail,
    });
  }

  const r = await fetch(`${SB_URL}/rest/v1/activation_codes`, {
    method  : "POST",
    headers : {
      "Content-Type" : "application/json",
      "apikey"       : SB_KEY,
      "Authorization": `Bearer ${SB_KEY}`,
      "Prefer"       : "return=representation",
    },
    body: JSON.stringify(codes),
  });

  const data = await r.json();
  if (!r.ok) return res.status(500).json({ error: "فشل الحفظ", debug: data });

  return res.status(200).json({
    success : true,
    count   : data.length,
    codes   : data.map(c => ({ code: c.code, plan: c.plan, period: c.period })),
  });
}
