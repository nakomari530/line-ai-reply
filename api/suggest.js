export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  const body = req.body || {};
  const text = body.text || "";

  const HF_API_KEY = process.env.HF_API_KEY;
  if (!HF_API_KEY) {
    console.error("Hugging Face API key is not set");
    return res.status(500).json({ error: "Hugging Face API key is not set" });
  }

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/TheBloke/vicuna-7B-1.1-HF",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: `このメッセージに短め・丁寧・冗談の3パターンで返信案を作ってください: ${text}`,
          parameters: { max_new_tokens: 150 }
        })
      }
    );

    const data = await response.json();
    console.log("HF Response:", JSON.stringify(data, null, 2));

    const messageContent =
      typeof data?.[0]?.generated_text === "string"
        ? data[0].generated_text
        : "";
    const lines = messageContent.split("\n").filter(line => line.trim() !== "");

    const suggestions = [
      { label: "A", text: lines[0] || "AIからの返信取得に失敗" },
      { label: "B", text: lines[1] || "" },
      { label: "C", text: lines[2] || "" }
    ];

    res.status(200).json({ ok: true, suggestions });
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: err.message });
  }
}
