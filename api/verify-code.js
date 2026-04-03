export const config = { api: { bodyParser: true } };

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const SB_URL = process.env.VITE_SUPABASE_URL;
  const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SB_URL || !SB_KEY) return res.status(500).json({ error: "Server config missing" });

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch {} }

  const code = (body?.code || "").trim().toUpperCase().replace(/\s/g, "");
  if (!code) return res.status(400).json({ error: "الكود مطلوب" });

  try {
    const r = await fetch(
      `${SB_URL}/rest/v1/activation_codes?code=eq.${encodeURIComponent(code)}&select=code,plan,period,months,used`,
      { headers: { "apikey": SB_KEY, "Authorization": `Bearer ${SB_KEY}` } }
    );
    const rows = await r.json();

    if (!rows?.length)      return res.status(404).json({ error: "الكود غير صحيح — تحقق من الكود وأعد المحاولة" });
    if (rows[0].used)       return res.status(409).json({ error: "هذا الكود تم استخدامه مسبقاً" });

    return res.status(200).json({
      valid : true,
      code  : rows[0].code,
      plan  : rows[0].plan,
      period: rows[0].period,
      months: rows[0].months,
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
