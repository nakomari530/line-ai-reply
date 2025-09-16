// api/suggest.js
export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const body = req.body || {};
  const text = body.text || "Hello";

  const suggestions = [
    { label: "A", text: `短め: ${text} への返信` },
    { label: "B", text: `丁寧: ${text} への返信` },
    { label: "C", text: `冗談: ${text} への返信` },
  ];

  return res.status(200).json({ ok: true, suggestions });
}
