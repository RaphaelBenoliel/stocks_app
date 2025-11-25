import { NextResponse } from "next/server";
import { searchStocks } from "@/lib/actions/finnhub.actions";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") ?? undefined;

    const stocks = await searchStocks(query);

    return NextResponse.json({ success: true, data: stocks });
  } catch (err) {
    console.error("stock search API error", err);
    return NextResponse.json(
      { success: false, message: "Failed to search stocks" },
      { status: 500 }
    );
  }
}
