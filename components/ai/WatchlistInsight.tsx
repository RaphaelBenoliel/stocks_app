"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export const WatchlistInsight = () => {
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/watchlist-insight");
      const json = await res.json();
      if (!res.ok || json?.success === false) {
        throw new Error(json?.message || "Failed to generate insight");
      }
      setSummary(json?.summary || "No insight available.");
    } catch (e) {
      console.error(e);
      setSummary(e instanceof Error ? e.message : "Unable to generate insight right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-700/80 bg-gray-900/60 shadow-xl p-5 space-y-3">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-yellow-400 font-semibold uppercase tracking-wide">AI insight</p>
          <h3 className="text-xl font-semibold text-gray-50">Watchlist pulse</h3>
          <p className="text-gray-400">Get a quick AI-generated pulse on your tracked symbols.</p>
        </div>
        <Button onClick={handleGenerate} disabled={loading} className="yellow-btn px-4 min-w-[140px]">
          {loading ? "Thinking…" : "Generate"}
        </Button>
      </div>
      <div className="rounded-xl border border-gray-700 bg-gray-900/80 p-4 min-h-[100px] text-gray-100 whitespace-pre-wrap">
        {summary || "No insight yet. Generate to see an AI summary."}
      </div>
    </div>
  );
};
