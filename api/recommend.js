import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export default async function handler(req, res) {
  try {
    // GETの場合の 'prompt' を取得
    var userPrompt = req.query.prompt;
    if (!userPrompt || typeof userPrompt !== 'string' || userPrompt.trim() === '') {
      // POSTの場合
      userPrompt = req.body.prompt;
    }

    // プロンプトが存在しない場合のチェック
    if (!userPrompt || typeof userPrompt !== 'string' || userPrompt.trim() === '') {
      return res.status(400).json({ 
        error: "Prompt is missing or empty in the request body." 
      });
    }
    
    
    // 2. 新しいプロンプトを構築（接頭辞とユーザーの入力を結合）
    const instructionPrefix = "次のニュース記事データを読み取り、各記事を要約してください。 各要約は最大120文字以内とし、JSON形式で出力してください。 出力フォーマット（必ずこの形式で出力）： [ { 'title': '記事タイトル', 'summary': '要約文', 'url': '記事URL' }, ... ] "
    const combinedPrompt = userPrompt
    const model = google("gemini-2.5-flash");

    //"次からおすすめを一個選んで100文字以内でまとめて,太陽光発電の開発問題を抑制し自然・地域と共生するには？（WWFポジションペーパーを改定）,CO2を地下に埋める!? 期待の技術「CCS」の専門家に聞いてみた（前編） | Concent,\n<b>土壌汚染</b>調査の3つの流れを徹底解説｜フェーズごとの手順と進め方"
    // const { text } = await generateText({
    //   model,
    //   prompt: "日本の首都はどこですか？"
    // });
    const { text } = await generateText({
      model,
      prompt: combinedPrompt,
      config: {
        maxTokens: 4096,
      },
    });
    let cleanText = text.trim();

    // 先頭の '```json' や '```'、末尾の '```' を取り除く
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.substring('```json'.length);
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.substring('```'.length);
    }

    if (cleanText.endsWith('```')) {
      cleanText = cleanText.substring(0, cleanText.length - '```'.length);
    }

    res.status(200).json({ result: cleanText });
  } catch (err) {
    // error
    console.error(err);
    res.status(500).json({ error: "Gemini request failed" });
  }
}

/**
 * 日本語や特殊文字を含む文字列をURLエンコードする関数
 * @param {string} rawString - エンコードしたい元の文字列
 * @returns {string} URLエンコードされた文字列
 */
function urlEncodeString(rawString) {
  // encodeURIComponent() を使用
  return encodeURIComponent(rawString);
}