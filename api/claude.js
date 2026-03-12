export const config = { api: { bodyParser: true } };

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  // GET /api/claude → تشخيص
  if (req.method === "GET") {
    const key = process.env.ANTHROPIC_API_KEY;
    return res.status(200).json({
      hasKey: !!key,
      keyPrefix: key ? key.slice(0, 15) + "..." : "غير موجود",
      node: process.version,
    });
  }

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "ANTHROPIC_API_KEY غير مضبوط" });

  try {
    let body = req.body;
    if (typeof body === "string") {
      try { body = JSON.parse(body); } catch {}
    }
    const { prompt, maxTokens = 800 } = body || {};
    if (!prompt) return res.status(400).json({ error: "no prompt" });

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: Math.min(Number(maxTokens) || 800, 1024),
        messages: [{ role: "user", content: String(prompt).slice(0, 3000) }],
      }),
    });

    const d = await r.json();
    if (!r.ok || d.error) {
      const msg = d.error?.message || JSON.stringify(d) || `HTTP ${r.status}`;
      return res.status(500).json({ error: msg });
    }

    const text = (d.content || []).map(b => b.text || "").join("").trim();
    if (!text) return res.status(500).json({ error: "ردّ فارغ" });
    return res.status(200).json({ text });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
