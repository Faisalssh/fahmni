export const config = { api: { bodyParser: true } };

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const SB_URL   = process.env.VITE_SUPABASE_URL;
  const SB_ANON  = process.env.VITE_SUPABASE_ANON;
  const SB_KEY   = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SB_URL || !SB_KEY) return res.status(500).json({ error: "Server config missing" });

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch {} }

  const { code, email, password, name } = body || {};

  if (!code || !email || !password) {
    return res.status(400).json({ error: "code و email و password مطلوبة" });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: "كلمة المرور 8 أحرف على الأقل" });
  }

  const cleanCode = code.trim().toUpperCase().replace(/\s/g,"");

  try {
    // 1) تحقق من الكود مرة ثانية (atomic check)
    const codeRes = await fetch(
      `${SB_URL}/rest/v1/activation_codes?code=eq.${encodeURIComponent(cleanCode)}&select=*`,
      { headers: { "apikey": SB_KEY, "Authorization": `Bearer ${SB_KEY}` } }
    );
    const codes = await codeRes.json();
    if (!codes?.length)  return res.status(404).json({ error: "الكود غير صحيح" });
    if (codes[0].used)   return res.status(409).json({ error: "الكود تم استخدامه" });
    const codeRow = codes[0];

    // 2) أنشئ الحساب عبر Supabase Auth
    const signupRes = await fetch(`${SB_URL}/auth/v1/signup`, {
      method : "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey"      : SB_ANON || SB_KEY,
      },
      body: JSON.stringify({
        email,
        password,
        data: { full_name: name || email.split("@")[0] },
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://fahmniplus.com"}/?verified=1`,
        },
      }),
    });
    const signupData = await signupRes.json();

    if (signupData.error || signupData.msg) {
      const msg = signupData.error_description || signupData.error?.message || signupData.msg || "فشل إنشاء الحساب";
      return res.status(400).json({ error: msg });
    }

    const userId = signupData.user?.id || signupData.id;
    if (!userId) return res.status(500).json({ error: "لم يُنشأ المستخدم بشكل صحيح" });

    // 3) احسب تاريخ انتهاء الاشتراك
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + (codeRow.months || 3));

    // 4) أنشئ profile مع الاشتراك
    await fetch(`${SB_URL}/rest/v1/profiles`, {
      method : "POST",
      headers: {
        "Content-Type" : "application/json",
        "apikey"       : SB_KEY,
        "Authorization": `Bearer ${SB_KEY}`,
        "Prefer"       : "return=minimal",
      },
      body: JSON.stringify({
        id              : userId,
        full_name       : name || email.split("@")[0],
        plan            : codeRow.plan,
        subscribed_until: expiresAt.toISOString(),
        trial_used      : 0,
        trial_limit     : 25,
        total_solved    : 0,
        total_correct   : 0,
        current_streak  : 0,
        placement_done  : false,
      }),
    }).catch(()=>{});

    // 5) وضع الكود كـ "مستخدم"
    await fetch(
      `${SB_URL}/rest/v1/activation_codes?code=eq.${encodeURIComponent(cleanCode)}`,
      {
        method : "PATCH",
        headers: {
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
    ).catch(()=>{});

    return res.status(200).json({
      success    : true,
      user_id    : userId,
      plan       : codeRow.plan,
      period     : codeRow.period,
      expires_at : expiresAt.toISOString(),
      needs_verify: true,
      message    : "تم إنشاء حسابك — تحقق من بريدك الإلكتروني لتفعيل الحساب",
    });

  } catch (e) {
    console.error("register-with-code error:", e.message);
    return res.status(500).json({ error: e.message });
  }
}
