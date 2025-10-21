// export default function handler(request, response) {
//   response.status(200).json({
//     body: request.body,
//     query: request.query,
//     cookies: request.cookies,
//   });
// }

import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export default async function handler(req, res) {
  try {
    // 1. リクエストボディから 'prompt' を取得
    const userPrompt = req.query.prompt;

    // プロンプトが存在しない場合のチェック
    if (!userPrompt || typeof userPrompt !== 'string' || userPrompt.trim() === '') {
      return res.status(400).json({ 
        error: "Prompt is missing or empty in the request body." 
      });
    }
    // 2. 新しいプロンプトを構築（接頭辞とユーザーの入力を結合）
    const instructionPrefix = "";
    const combinedPrompt = instructionPrefix + userPrompt;
    const model = google("gemini-2.0-flash");

    //"次からおすすめを一個選んで100文字以内でまとめて,太陽光発電の開発問題を抑制し自然・地域と共生するには？（WWFポジションペーパーを改定）,CO2を地下に埋める!? 期待の技術「CCS」の専門家に聞いてみた（前編） | Concent,\n<b>土壌汚染</b>調査の3つの流れを徹底解説｜フェーズごとの手順と進め方"
    // const { text } = await generateText({
    //   model,
    //   prompt: "日本の首都はどこですか？"
    // });
    const { text } = await generateText({
      model,
      prompt: combinedPrompt
    });

    res.status(200).json({ result: text });
  } catch (err) {
    // error
    console.error(err);
    res.status(500).json({ error: "Gemini request failed" });
  }
}