// /api/save-rss.js
import Parser from 'rss-parser';
import { neon } from '@neondatabase/serverless';

const parser = new Parser();
const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  const feedUrl1 = 'https://api.rss2json.com/v1/api.json?rss_url=https://www.google.co.jp/alerts/feeds/11818790637394781868/5730743916708813572'; // 取得したいRSSフィードURL

  try {
    const feed = await parser.parseURL(feedUrl);

    for (const item of feed.items.slice(0, 10)) {
      await sql`
        INSERT INTO environment (categoryId, feedId, title, link, description, published)
        VALUES (
          1,
          ${item.id}
          ${item.title},
          ${item.link},
          ${item.content},
          ${item.published}
        )
        ON CONFLICT DO NOTHING;
      `;
    }

    res.status(200).json({ message: 'RSS items saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '保存に失敗しました' });
  }

  const feedUrl2 = 'https://api.rss2json.com/v1/api.json?rss_url=https://www.google.co.jp/alerts/feeds/11818790637394781868/5685444894200799844'; // 取得したいRSSフィードURL

  try {
    const feed = await parser.parseURL(feedUrl2);

    for (const item of feed.items.slice(0, 10)) {
      await sql`
        INSERT INTO environment (categoryId, feedId, title, link, description, published)
        VALUES (
          2,
          ${item.id}
          ${item.title},
          ${item.link},
          ${item.content},
          ${item.published}
        )
        ON CONFLICT DO NOTHING;
      `;
    }

    res.status(200).json({ message: 'RSS items saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '保存に失敗しました' });
  }

  const feedUrl3 = 'https://api.rss2json.com/v1/api.json?rss_url=https://www.google.co.jp/alerts/feeds/11818790637394781868/16051316454223707398'; // 取得したいRSSフィードURL

  try {
    const feed = await parser.parseURL(feedUrl3);

    for (const item of feed.items.slice(0, 10)) {
      await sql`
        INSERT INTO environment (categoryId, feedId, title, link, description, published)
        VALUES (
          3,
          ${item.id}
          ${item.title},
          ${item.link},
          ${item.content},
          ${item.published}
        )
        ON CONFLICT DO NOTHING;
      `;
    }

    res.status(200).json({ message: 'RSS items saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '保存に失敗しました' });
  }
}
