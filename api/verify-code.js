export const config = { api: { bodyParser: true } };

/* Rate limiting - حماية من التخمين */
const attempts = new Map();

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  /* ── Rate Limit: 5 محاولات كل 60 ثانية لكل IP ── */
  const ip = (req.headers["x-forwarded-for"]||"").split(",")[0].trim() || "unknown";
  const now = Date.now();
  const key = `${ip}`;
  const record = attempts.get(key) || { count:0, first:now };

  if (now - record.first > 60000) {
    attempts.set(key, { count:1, first:now });
  } else {
    record.count++;
    attempts.set(key, record);
    if (record.count > 5) {
      console.warn(`Rate limit hit: ${ip} tried ${record.count} times`);
      return res.status(429).json({
        error: "محاولات كثيرة — انتظر دقيقة واحدة قبل المحاولة مجدداً"
      });
    }
  }

  const SB_URL = process.env.VITE_SUPABASE_URL;
  const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SB_URL || !SB_KEY) return res.status(500).json({ error: "Server config missing" });

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch {} }

  const code = (body?.code || "").trim().toUpperCase().replace(/\s/g, "");
  if (!code) return res.status(400).json({ error: "الكود مطلوب" });
  
  /* ── تحقق من طول الكود (19 خانة) ── */
  if (code.length !== 19) {
    return res.status(400).json({ error: "صيغة الكود غير صحيحة" });
  }

  try {
    const r = await fetch(
      `${SB_URL}/rest/v1/activation_codes?code=eq.${encodeURIComponent(code)}&select=code,plan,period,months,used`,
      { headers: { "apikey": SB_KEY, "Authorization": `Bearer ${SB_KEY}` } }
    );
    const rows = await r.json();

    if (!rows?.length) {
      /* سجّل المحاولة الفاشلة */
      await fetch(`${SB_URL}/rest/v1/code_attempts`, {
        method:"POST",
        headers:{"Content-Type":"application/json","apikey":SB_KEY,"Authorization":`Bearer ${SB_KEY}`,"Prefer":"return=minimal"},
        body:JSON.stringify({ ip, code_tried: code.slice(0,8)+"****" })
      }).catch(()=>{});
      return res.status(404).json({ error: "الكود غير صحيح — تحقق من الكود وأعد المحاولة" });
    }
    if (rows[0].used) return res.status(409).json({ error: "هذا الكود تم استخدامه مسبقاً" });

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
