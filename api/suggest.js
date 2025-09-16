import fetch from "node-fetch"; // Node 18+なら不要

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const body = req.body || {};
  const text = body.text || "";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful LINE reply assistant." },
          { role: "user", content: `このメッセージに短め・丁寧・冗談の3パターンで返信案を作って: ${text}` }
        ],
        max_tokens: 150,
        temperature: 0.8
      })
    });

    const data = await response.json();
    const suggestions = [
      { label: "A", text: data.choices[0].message.content.split("\n")[0] },
      { label: "B", text: data.choices[0].message.content.split("\n")[1] || "" },
      { label: "C", text: data.choices[0].message.content.split("\n")[2] || "" }
    ];

    res.status(200).json({ ok: true, suggestions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
