export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const body = req.body || {};
  const text = body.text || "";

  // APIキーが未設定ならエラー
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: "OpenAI API key is not set" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful LINE reply assistant." },
          { role: "user", content: `このメッセージに短め・丁寧・冗談の3パターンで返信案を作ってください: ${text}` }
        ],
        max_tokens: 150,
        temperature: 0.8
      })
    });

    const data = await response.json();

    // undefined参照対策
    const messageContent = data.choices?.[0]?.message?.content || "AIからの返信取得に失敗";

    const suggestions = [
      { label: "A", text: messageContent.split("\n")[0] || "" },
      { label: "B", text: messageContent.split("\n")[1] || "" },
      { label: "C", text: messageContent.split("\n")[2] || "" }
    ];

    res.status(200).json({ ok: true, suggestions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
