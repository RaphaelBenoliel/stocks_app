import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/better-auth/auth";
import { getNews } from "@/lib/actions/finnhub.actions";

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: true,
        summary: "AI summaries unavailable: set GEMINI_API_KEY in .env and restart the server.",
      });
    }

    const articles = await getNews();
    if (!articles?.length) {
      return NextResponse.json({
        success: true,
        summary: "No news articles to summarize right now. Check back later.",
      });
    }

    const context = articles
      .slice(0, 10)
      .map(
        (a) =>
          `${a.headline} (${a.source}): ${a.summary?.slice(0, 200) || ""}`
      )
      .join("\n");

    const prompt = `You are summarizing market news for a retail investor. From these headlines and blurbs, give a concise 70-90 word digest. Highlight themes (tech, macro, energy, etc.), mention stand-out movers if clear, and end with one practical watchpoint. Avoid financial advice.\n\n${context}`;

    try {
      const res = await fetch(`${GEMINI_URL}?key=${encodeURIComponent(apiKey)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Gemini error ${res.status}: ${text}`);
      }

      const json = await res.json();
      const summary =
        json?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No summary returned. Try again soon.";

      return NextResponse.json({ success: true, summary });
    } catch (aiErr) {
      console.error("Gemini call failed, falling back", aiErr);
      const fallback = buildLocalSummary(articles);
      return NextResponse.json({ success: true, summary: fallback });
    }
  } catch (err) {
    console.error("news-summary error", err);
    return NextResponse.json({
      success: true,
      summary: "AI summary is temporarily unavailable. Please try again.",
    });
  }
}

function buildLocalSummary(articles: MarketNewsArticle[]) {
  if (!articles?.length) return "No news articles to summarize right now.";
  const top = articles.slice(0, 5);
  const bullets = top
    .map((a) => `• ${a.headline} (${a.source})`)
    .join("\n");
  return `AI service unavailable. Here are the top headlines instead:\n${bullets}`;
}
