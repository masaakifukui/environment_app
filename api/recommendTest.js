import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export default async function handler(req, res) {
  try {
    // 2. 新しいプロンプトを構築（接頭辞とユーザーの入力を結合）
    const combinedPrompt = "### 実行手順と制約1.  **入力データ**：提供されるニュースデータのtitle、内容、URLを読み取ります。2.  **要約の目的**：記事の最も重要な要点を抽出することに集中してください。3.  **制約**：* 各記事の要約は、**厳密に最大120文字以内**としなさい。* 出力は、以下の**JSON形式に厳密に従い**、他のコメントや説明は一切含めないこと。### 出力フォーマット（厳守）[{'title': '記事タイトル','summary': '要約文','url': '記事URL'},...]### ニュースデータ[title: 「世界ウミガメの日」｜研究・教育 - 名古屋港水族館,内容: また、卵の時の温度で性別が分かれる温度依存型性決定のため、地球<b>温暖化</b>の影響でメスばかりになってしまう可能性があると言われています。 身近なことで&nbsp;...,URL: https://nagoyaaqua.jp/study/column/26552/]"
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