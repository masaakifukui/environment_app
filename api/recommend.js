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
    userPromt = "--- ニュースデータ --- タイトル: 「世界ウミガメの日」｜研究・教育 - 名古屋港水族館 内容: また、卵の時の温度で性別が分かれる温度依存型性決定のため、地球<b>温暖化</b>の影響でメスばかりになってしまう可能性があると言われています。 身近なことで&nbsp;... URL: https://nagoyaaqua.jp/study/column/26552/ タイトル: 岩手県がグリーン／ブルーボンド発行 大船渡山林火災の支援も - NHKニュース 内容: 【NHK】岩手県は、地球<b>温暖化</b>対策や海洋資源の保護などに取り組む資金を調達する債権、「グリーン／ブルーボンド」を３回目となる今年度も発行することを決… URL: https://www3.nhk.or.jp/lnews/morioka/20250616/6040025919.html タイトル: 【申込受付中】（オンライン開催）第135回HGPIセミナー「命を守る『熱』の警鐘 ― 気候変動時代 ... 内容: 地球<b>温暖化</b>が進む中で、身体が暑さに慣れることを指し、暑熱順化とも呼ばれる暑熱と人間の健康との関係は、差し迫った課題となっています。 URL: https://hgpi.org/events/hs135.html"
    // 2. 新しいプロンプトを構築（接頭辞とユーザーの入力を結合）
    const instructionPrefix = "次のニュース記事データを読み取り、各記事を要約してください。 各要約は最大120文字以内とし、JSON形式で出力してください。 出力フォーマット（必ずこの形式で出力）： [ { 'title': '記事タイトル', 'summary': '要約文', 'url': '記事URL' }, ... ] "
    const combinedPrompt = instructionPrefix + userPrompt
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

    res.status(200).json({ result: text });
  } catch (err) {
    // error
    console.error(err);
    res.status(500).json({ error: "Gemini request failed" });
  }
}