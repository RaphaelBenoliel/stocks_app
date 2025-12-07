"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export const NewsSummary = () => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ai/news-summary");
      const json = await res.json();
      if (!res.ok || json?.success === false) {
        throw new Error(json?.message || "Failed to summarize news");
      }
      setSummary(json?.summary || "No summary available.");
    } catch (e) {
      console.error(e);
      setSummary(e instanceof Error ? e.message : "Unable to summarize right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-700/80 bg-gray-900/60 shadow-xl p-5 space-y-3">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-yellow-400 font-semibold uppercase tracking-wide">AI summary</p>
          <h3 className="text-xl font-semibold text-gray-50">Market digest</h3>
          <p className="text-gray-400">Let Gemini condense today’s headlines into a quick brief.</p>
        </div>
        <Button onClick={handleSummarize} disabled={loading} className="yellow-btn px-4 min-w-[140px]">
          {loading ? "Summarizing…" : "Summarize"}
        </Button>
      </div>
      <div className="rounded-xl border border-gray-700 bg-gray-900/80 p-4 min-h-[100px] text-gray-100 whitespace-pre-wrap">
        {summary || "No summary yet. Summarize to see an AI digest."}
      </div>
    </div>
  );
};
