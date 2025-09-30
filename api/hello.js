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
    const model = google("gemini-2.0-flash");

    const { text } = await generateText({
      model,
      prompt: "Hello Gemini, can you respond with a short greeting?"
    });

    res.status(200).json({ result: text });
  } catch (err) {
    // error
    console.error(err);
    res.status(500).json({ error: "Gemini request failed" });
  }
}