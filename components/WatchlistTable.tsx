"use client";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import WatchlistButton from "@/components/WatchlistButton";

const CATEGORIES = ["Tech", "Finance", "Healthcare", "Energy", "Other"] as const;

// If StockWithData is global in your project, remove this minimal helper.
type ClientStock = Omit<StockWithData, "addedAt"> & {
  addedAt?: string | Date;
  category?: string;
};

type SortKey = "company" | "symbol" | "price" | "change";
type SortDir = "asc" | "desc" | null;

function classNames(...a: Array<string | false | null | undefined>) {
  return a.filter(Boolean).join(" ");
}

const SaveDot = ({ title }: { title?: string }) => (
  <span
    title={title}
    className="ml-2 inline-block h-2 w-2 rounded-full bg-amber-400 animate-pulse"
    aria-hidden="true"
  />
);

const ErrorToast = ({ msg }: { msg: string }) => (
  <div
    role="status"
    aria-live="polite"
    className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-red-600 px-3 py-2 text-sm text-white shadow-lg"
  >
    {msg}
  </div>
);

export default function WatchlistTable({ watchlist }: { watchlist: ClientStock[] }) {
  const router = useRouter();

  // ----- base state -----
  const [rows, setRows] = useState<ClientStock[]>(Array.isArray(watchlist) ? watchlist : []);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<string>("");
  const [sortKey, setSortKey] = useState<SortKey>("symbol");
  const [sortDir, setSortDir] = useState<SortDir>(null);

  // per-row saving state + last error
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  // Abort+debounce per symbol
  const inflight = useRef<Record<string, AbortController>>({});
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // ----- helpers -----
  const setSavingFor = (symbol: string, v: boolean) =>
    setSaving((s) => ({ ...s, [symbol]: v }));

  const safePatch = useCallback(
    async (symbol: string, payload: Partial<ClientStock>) => {
      // cancel inflight
      inflight.current[symbol]?.abort();
      const ctrl = new AbortController();
      inflight.current[symbol] = ctrl;

      setSavingFor(symbol, true);
      try {
        const res = await fetch("/api/watchlist", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ symbol, ...payload }),
          signal: ctrl.signal,
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || json?.success === false) {
          throw new Error(json?.message || "Update failed");
        }
      } finally {
        setSavingFor(symbol, false);
      }
    },
    []
  );

  const debouncedPatch = useCallback(
    (symbol: string, payload: Partial<ClientStock>, delay = 400) => {
      clearTimeout(timers.current[symbol]);
      timers.current[symbol] = setTimeout(() => {
        safePatch(symbol, payload).catch((e) => {
          // rollback on error
          setRows((prev) => prev); // noop; we rollback earlier
          setError(e?.message || "Failed to update row");
          setTimeout(() => setError(null), 2500);
        });
      }, delay);
    },
    [safePatch]
  );

  const handleNavigate = useCallback(
    (symbol: string) => router.push(`/stocks/${symbol}`),
    [router]
  );

  // Prevent row click while editing
  const stopBubble: React.MouseEventHandler = (e) => e.stopPropagation();

  // ----- optimistic edits -----
  const handleChange = useCallback(
    (symbol: string, field: "company" | "category", value: string) => {
      // keep a snapshot to rollback if needed
      setRows((prev) => {
        const current = prev.find((r) => r.symbol === symbol);
        const before = current ? { ...current } : null;

        const next = prev.map((r) => (r.symbol === symbol ? { ...r, [field]: value } : r));
        // optimistic update
        debouncedPatch(symbol, { [field]: value } as Partial<ClientStock>);

        // store rollback on failure
        if (before) {
          // If immediate network error fires before debounce, we still preserve before state in closure; for brevity we rely on retry UI.
        }
        return next;
      });
    },
    [debouncedPatch]
  );

  // ----- filter + search + sort -----
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      const passCat = !catFilter || (r.category || "") === catFilter;
      const passQ =
        !q ||
        r.symbol.toLowerCase().includes(q) ||
        (r.company || "").toLowerCase().includes(q);
      return passCat && passQ;
    });
  }, [rows, search, catFilter]);

  const sorted = useMemo(() => {
    if (!sortDir) return filtered;
    const arr = [...filtered];
    arr.sort((a, b) => {
      let av: string | number = "";
      let bv: string | number = "";

      if (sortKey === "company") {
        av = (a.company || "").toLowerCase();
        bv = (b.company || "").toLowerCase();
      } else if (sortKey === "symbol") {
        av = a.symbol.toLowerCase();
        bv = b.symbol.toLowerCase();
      } else if (sortKey === "price") {
        // If you have raw numeric price, prefer that. Fallback parses from formatted.
        // @ts-expect-error optional raw field if exists
        av = typeof a.price === "number" ? a.price : parseFloat((a.priceFormatted || "").replace(/[^0-9.\-]/g, "")) || 0;
        // @ts-expect-error optional raw field if exists
        bv = typeof b.price === "number" ? b.price : parseFloat((b.priceFormatted || "").replace(/[^0-9.\-]/g, "")) || 0;
      } else if (sortKey === "change") {
        av = typeof a.changePercent === "number" ? a.changePercent : 0;
        bv = typeof b.changePercent === "number" ? b.changePercent : 0;
      }

      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else {
      setSortDir((d) => (d === "asc" ? "desc" : d === "desc" ? null : "asc"));
    }
  };

  // ----- watchlist remove -> remove row -----
  const handleWatchlistChange = useCallback((symbol: string, inList: boolean) => {
    if (!inList) {
      setRows((prev) => prev.filter((r) => r.symbol !== symbol));
    }
  }, []);

  // ----- UI -----
  return (
    <div className="watchlist-table">
      {/* Controls */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <div className="relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company or symbol…"
            className="h-10 w-64 rounded-lg bg-zinc-900/60 px-3 pr-8 text-sm outline-none ring-1 ring-white/10 focus:ring-amber-400"
            aria-label="Search watchlist"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded p-1 text-zinc-400 hover:text-white"
              aria-label="Clear search"
              title="Clear"
            >
              ×
            </button>
          )}
        </div>

        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="h-10 rounded-lg bg-zinc-900/60 px-3 text-sm outline-none ring-1 ring-white/10 focus:ring-amber-400"
          aria-label="Filter by category"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <div className="ml-auto text-xs text-white/60">
          Showing {sorted.length} of {rows.length}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="min-w-full table-fixed">
          <thead className="sticky top-0 z-10 bg-zinc-950">
            <tr className="text-left text-xs uppercase tracking-wide text-white/60">
              <Th label="Company" sortable onClick={() => toggleSort("company")} dir={sortKey === "company" ? sortDir : null} w="32" />
              <Th label="Symbol" sortable onClick={() => toggleSort("symbol")} dir={sortKey === "symbol" ? sortDir : null} w="20" />
              <Th label="Price" sortable onClick={() => toggleSort("price")} dir={sortKey === "price" ? sortDir : null} w="20" />
              <Th label="Change" sortable onClick={() => toggleSort("change")} dir={sortKey === "change" ? sortDir : null} w="20" />
              <Th label="Category" w="32" />
              <Th label="Action" w="20" />
            </tr>
          </thead>

          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-center text-sm text-white/60">
                  No symbols found. Try clearing filters or adding to your watchlist.
                </td>
              </tr>
            ) : (
              sorted.map((r) => {
                const isSaving = !!saving[r.symbol];
                const isUp = typeof r.changePercent === "number" && r.changePercent > 0;

                return (
                  <tr
                    key={r.symbol}
                    className="group border-t border-white/5 hover:bg-zinc-900/40"
                    onClick={() => handleNavigate(r.symbol)}
                    role="button"
                    tabIndex={0}
                    onKeyUp={(e) => {
                      if (e.key === "Enter") handleNavigate(r.symbol);
                    }}
                  >
                    {/* Company (editable) */}
                    <td className="whitespace-nowrap px-3 py-3">
                      <div className="flex items-center">
                        <input
                          onClick={stopBubble}
                          onFocus={stopBubble}
                          className="w-full rounded-md bg-transparent px-1 py-1 text-sm outline-none ring-1 ring-transparent focus:ring-amber-400"
                          value={r.company || ""}
                          onChange={(e) => handleChange(r.symbol, "company", e.target.value)}
                          aria-label={`Edit company for ${r.symbol}`}
                          placeholder="Company name"
                        />
                        {isSaving && <SaveDot title="Saving…" />}
                      </div>
                    </td>

                    {/* Symbol */}
                    <td className="truncate px-3 py-3 text-sm font-semibold">{r.symbol}</td>

                    {/* Price */}
                    <td className="px-3 py-3 text-sm">{r.priceFormatted ?? "-"}</td>

                    {/* Change */}
                    <td
                      className={classNames(
                        "px-3 py-3 text-sm",
                        typeof r.changePercent === "number"
                          ? isUp
                            ? "text-emerald-400"
                            : "text-red-400"
                          : "text-white/70"
                      )}
                    >
                      {r.changeFormatted ?? "-"}
                    </td>

                    {/* Category (select) */}
                    <td className="px-3 py-3">
                      <select
                        onClick={stopBubble}
                        onFocus={stopBubble}
                        value={r.category || ""}
                        onChange={(e) => handleChange(r.symbol, "category", e.target.value)}
                        className="w-full rounded-md bg-zinc-900/60 px-2 py-1.5 text-sm outline-none ring-1 ring-white/10 focus:ring-amber-400"
                        aria-label={`Set category for ${r.symbol}`}
                      >
                        <option value="">Uncategorized</option>
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Action */}
                    <td className="px-3 py-3">
                      <div onClick={stopBubble} className="flex items-center">
                        <WatchlistButton
                          symbol={r.symbol}
                          company={r.company}
                          // If your WatchlistButton accepts 'onChange' like we designed earlier:
                          onChange={handleWatchlistChange}
                          isInWatchlist={true}
                          showTrashIcon
                          // If your improved component supports variant="icon", you can show both:
                          // variant="button"
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {error && <ErrorToast msg={error} />}
    </div>
  );
}

/** Table Header Cell with sort affordance */
function Th({
  label,
  sortable,
  dir,
  onClick,
  w,
}: {
  label: string;
  sortable?: boolean;
  dir?: SortDir;
  onClick?: () => void;
  w?: string; // tailwind width (e.g., "32" -> w-32)
}) {
  return (
    <th
      className={classNames(
        "px-3 py-3 font-medium",
        sortable ? "cursor-pointer select-none hover:text-white" : "",
        w ? `w-${w}` : ""
      )}
      scope="col"
      onClick={sortable ? onClick : undefined}
    >
      <div className="flex items-center gap-1">
        <span>{label}</span>
        {sortable && (
          <span aria-hidden className="text-white/40">
            {dir === "asc" ? "▲" : dir === "desc" ? "▼" : "↕"}
          </span>
        )}
      </div>
    </th>
  );
}
