import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export default async function handler(req, res) {
  try {
    // GETの場合の 'prompt' を取得
    var articles = req.query.prompt;
    if (!articles || typeof articles !== 'string' || articles.trim() === '') {
      // POSTの場合
      articles = req.body.prompt;
    }

    // プロンプトが存在しない場合のチェック
    if (!articles || typeof articles !== 'string' || articles.trim() === '') {
      return res.status(400).json({ 
        error: "Prompt is missing or empty in the request body." 
      });
    }

    res.status(200).json({ result: articles });
    // 全記事の情報を格納する文字列を構築
    // let articlesContent = "";
    // articles.forEach((article, index) => {
    //     // 各記事を明確な区切り（例: ### 記事 N ###）で区切る
    //     articlesContent += `
    // ### 記事 ${index + 1} ###
    // タイトル: ${article.title}
    // URL: ${article.url}
    // 本文: ${article.text}
    // `;
    // });

    // // プロンプトを構築
    // const prompt = `
    // 以下の「--- 記事リスト ---」内にある複数の記事を、順番にすべて要約してください。
    // 各要約文は最大120文字以内とします。
    // 出力は必ず**JSON形式の配列**で、各要素は以下の厳密なオブジェクト形式で出力してください。
    // **特に'url'の値は、プロンプトで与えられた元のURLを各記事に正確に含めてください。**

    // 出力形式:
    // [
    //   { "title": "記事タイトル", "summary": "要約文", "url": "元の記事URL" },
    //   ... (記事の数だけ繰り返す)
    // ]

    // --- 記事リスト ---
    // ${articlesContent}
    // `;
    // const model = google("gemini-2.5-flash")

    //"次からおすすめを一個選んで100文字以内でまとめて,太陽光発電の開発問題を抑制し自然・地域と共生するには？（WWFポジションペーパーを改定）,CO2を地下に埋める!? 期待の技術「CCS」の専門家に聞いてみた（前編） | Concent,\n<b>土壌汚染</b>調査の3つの流れを徹底解説｜フェーズごとの手順と進め方"
    // const { text } = await generateText({
    //   model,
    //   prompt: "日本の首都はどこですか？"
    // // });
    // const { text } = await generateText({
    //   model,
    //   prompt: prompt,
    //   config: {
    //     maxTokens: 4096,
    //   },
    // });

    // res.status(200).json({ result: text });
  } catch (err) {
    // error
    console.error(err);
    res.status(500).json({ error: "Gemini request failed" });
  }
}