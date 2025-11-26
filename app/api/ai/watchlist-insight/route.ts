import { NextResponse } from "next/server";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { getWatchlist } from "@/lib/actions/watchlist.actions";
import { getStockDataForSymbols } from "@/lib/actions/finnhub.actions";

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";


export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: true,
        summary:
          "AI insights are unavailable because GEMINI_API_KEY is not configured. Add it to .env to enable live summaries.",
      });
    }

    const userId = (session.user.id as string) || (session.user.email as string);
    const watchlist = await getWatchlist(userId);
    const symbols = (watchlist || []).map((w) => w.symbol);

    if (!symbols.length) {
      return NextResponse.json({
        success: true,
        summary: "Your watchlist is empty. Add a few symbols to get an AI summary of price action and momentum.",
      });
    }

    const stocks = await getStockDataForSymbols(symbols);
    const lines = stocks
      .map((s) => {
        const price = s.currentPrice !== undefined ? `$${s.currentPrice.toFixed(2)}` : "n/a";
        const change = s.changePercent !== undefined ? `${s.changePercent.toFixed(2)}%` : "n/a";
        const cap = s.marketCap ? s.marketCap : "n/a";
        return `${s.symbol} (${s.company}): price ${price}, change ${change}, market cap ${cap}`;
      })
      .join("\n");

    const prompt = `Give a concise, upbeat summary for these watchlist items. Highlight top gainers/losers, notable momentum, and suggest one action-oriented takeaway. Keep it under 80 words and avoid financial advice.\n\n${lines}`;

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
      "No summary returned. Try again in a moment.";

    return NextResponse.json({ success: true, summary });
  } catch (err) {
    console.error("watchlist-insight error", err);
    return NextResponse.json(
      { success: true, summary: "AI summary is temporarily unavailable. Please try again soon." },
      { status: 200 }
    );
  }
}
