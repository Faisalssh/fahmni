export const config = { api: { bodyParser: true } };

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

  const { code, userId, userToken } = body;

  if (!code || !userId) return res.status(400).json({ error: "code و userId مطلوبان" });

  // تنظيف الكود
  const cleanCode = code.trim().toUpperCase().replace(/\s/g,"");
  if (!cleanCode) return res.status(400).json({ error: "الكود فارغ" });

  try {
    // 1) جلب الكود من DB
    const fetchR = await fetch(
      `${SB_URL}/rest/v1/activation_codes?code=eq.${encodeURIComponent(cleanCode)}&select=*`,
      { headers: { "apikey": SB_KEY, "Authorization": `Bearer ${SB_KEY}` } }
    );
    const rows = await fetchR.json();

    if (!rows || rows.length === 0) {
      return res.status(404).json({ error: "الكود غير موجود — تحقق من الكود وأعد المحاولة" });
    }

    const row = rows[0];

    // 2) تحقق إذا مستخدم
    if (row.used) {
      return res.status(409).json({ error: "هذا الكود تم استخدامه مسبقاً" });
    }

    // 3) احسب تاريخ الانتهاء
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + row.months);

    // 4) فعّل الاشتراك في profiles
    const profR = await fetch(
      `${SB_URL}/rest/v1/profiles?id=eq.${userId}`,
      {
        method  : "PATCH",
        headers : {
          "Content-Type" : "application/json",
          "apikey"       : SB_KEY,
          "Authorization": `Bearer ${SB_KEY}`,
        },
        body: JSON.stringify({
          plan            : row.plan,
          subscribed_until: expiresAt.toISOString(),
          updated_at      : new Date().toISOString(),
        }),
      }
    );
    if (!profR.ok) {
      const e = await profR.json();
      return res.status(500).json({ error: "فشل تفعيل الاشتراك", debug: e });
    }

    // 5) وضع الكود كـ "مستخدم"
    await fetch(
      `${SB_URL}/rest/v1/activation_codes?code=eq.${encodeURIComponent(cleanCode)}`,
      {
        method  : "PATCH",
        headers : {
          "Content-Type" : "application/json",
          "apikey"       : SB_KEY,
          "Authorization": `Bearer ${SB_KEY}`,
        },
        body: JSON.stringify({
          used   : true,
          used_by: userId,
          used_at: new Date().toISOString(),
        }),
      }
    );

    return res.status(200).json({
      success   : true,
      plan      : row.plan,
      period    : row.period,
      months    : row.months,
      expires_at: expiresAt.toISOString(),
      message   : `تم تفعيل اشتراك ${row.plan === "basic" ? "التأسيسي" : "الاحترافي"} لمدة ${row.months} شهر`,
    });

  } catch (e) {
    console.error("redeem-code error:", e.message);
    return res.status(500).json({ error: e.message });
  }
}
