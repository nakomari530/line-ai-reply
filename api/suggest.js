const fetch = require("node-fetch");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const { text } = req.body || {};
  if (!text) return res.status(400).json({ error: "No text provided" });

  const HF_API_KEY = process.env.HF_API_KEY;
  if (!HF_API_KEY) return res.status(500).json({ error: "HF_API_KEY not set" });

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/EleutherAI/gpt-neo-125m",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: `このメッセージに短め・丁寧・冗談の3パターンで返信案を作ってください: ${text}`,
          parameters: { max_new_tokens: 150 },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    const replyText = data[0]?.generated_text || "AIからの返信取得に失敗";

    // 簡単に3パターンに分割
    const lines = replyText.split("\n").filter(Boolean);
    const suggestions = [
      { label: "A", text: lines[0] || "AIからの返信取得に失敗" },
      { label: "B", text: lines[1] || "" },
      { label: "C", text: lines[2] || "" },
    ];

    res.status(200).json({ ok: true, suggestions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
