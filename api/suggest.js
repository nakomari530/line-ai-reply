export default async function handler(req, res) {
  const body = await req.body;
  const userMessage = body.text || "こんにちは";

  // OpenAIなどのAIに送る処理（ここではダミーの返信）
  const reply = `AI案：「${userMessage}」への返信例です`;

  res.status(200).json({ reply });
}
