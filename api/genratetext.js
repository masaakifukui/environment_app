import { generateText } from 'ai';
import { google } from '@ai-sdk/google';

export default async function handler(req, res) {
  try {
    const { prompt } = req.body;

    // Geminiモデルの指定
    const model = google('models/gemini-pro');

    // テキスト生成
    const result = await generateText({
      model: model,
      prompt: prompt,
    });

    // レスポンスをJSON形式で返す
    res.status(200).json({ text: result.text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate text' });
  }
}
