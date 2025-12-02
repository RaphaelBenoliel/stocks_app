"use client";

import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getChangeColorClass, formatPrice } from "@/lib/utils";

type AlertWithData = Alert & { id: string; currentPrice?: number; changePercent?: number };
type WatchlistOption = { symbol: string; company: string };

export function AlertManager({ initialAlerts, watchlist }: { initialAlerts: AlertWithData[]; watchlist: WatchlistOption[] }) {
  const [alerts, setAlerts] = useState<AlertWithData[]>(initialAlerts || []);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    symbol: watchlist[0]?.symbol || "",
    company: watchlist[0]?.company || "",
    alertName: "",
    alertType: "upper" as "upper" | "lower",
    threshold: "",
  });
  const [saving, setSaving] = useState(false);

  const sorted = useMemo(() => alerts.slice().sort((a, b) => a.symbol.localeCompare(b.symbol)), [alerts]);

  const handleCreate = async () => {
    setSaving(true);
    try {
      const payload = { ...form, threshold: Number(form.threshold) };
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || json?.success === false) throw new Error(json?.message || "Failed to create alert");
      if (json?.data) setAlerts((prev) => [json.data, ...prev]);
      setOpen(false);
      setForm({ symbol: watchlist[0]?.symbol || "", company: watchlist[0]?.company || "", alertName: "", alertType: "upper", threshold: "" });
    } catch (e) {
      console.error(e);
      alert(e instanceof Error ? e.message : "Failed to create alert");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const prev = alerts;
    setAlerts((a) => a.filter((al) => al.id !== id));
    const res = await fetch("/api/alerts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const json = await res.json();
    if (!res.ok || json?.success === false) {
      setAlerts(prev);
      alert(json?.message || "Failed to delete alert");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="yellow-btn px-4">Create alert</Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border border-gray-700 text-gray-200">
            <DialogHeader>
              <DialogTitle>Create alert</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-2">
              <div className="space-y-1">
                <Label>Symbol</Label>
                <select
                  value={form.symbol}
                  className="h-11 w-full rounded-md bg-gray-800 border border-gray-700 px-3 text-gray-200"
                  onChange={(e) => {
                    const sym = e.target.value;
                    const match = watchlist.find((w) => w.symbol === sym);
                    setForm((f) => ({ ...f, symbol: sym, company: match?.company || f.company }));
                  }}
                >
                  {watchlist.map((w) => (
                    <option key={w.symbol} value={w.symbol}>
                      {w.symbol} — {w.company}
                    </option>
                  ))}
                  {!watchlist.length && <option value="">Type a symbol</option>}
                </select>
              </div>

              <div className="space-y-1">
                <Label>Alert name</Label>
                <Input value={form.alertName} onChange={(e) => setForm((f) => ({ ...f, alertName: e.target.value }))} placeholder="Breakout watch" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label>Type</Label>
                  <select
                    value={form.alertType}
                    className="h-11 w-full rounded-md bg-gray-800 border border-gray-700 px-3 text-gray-200"
                    onChange={(e) => setForm((f) => ({ ...f, alertType: e.target.value as 'upper' | 'lower' }))}
                  >
                    <option value="upper">Price above</option>
                    <option value="lower">Price below</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label>Threshold (USD)</Label>
                  <Input
                    value={form.threshold}
                    type="number"
                    onChange={(e) => setForm((f) => ({ ...f, threshold: e.target.value }))}
                    placeholder="150"
                  />
                </div>
              </div>

              <Button disabled={saving} onClick={handleCreate} className="yellow-btn w-full">
                {saving ? 'Saving…' : 'Save alert'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {sorted.length === 0 && (
          <div className="col-span-full rounded-2xl border border-gray-700/80 bg-gray-900/60 p-6 text-center text-gray-400">
            <p className="text-lg font-semibold mb-2">No alerts yet</p>
            <p className="text-gray-500">Create your first alert to get notified on price moves.</p>
          </div>
        )}

        {sorted.map((alert) => (
          <article key={alert.id} className="rounded-2xl border border-gray-700/80 bg-gray-900/60 shadow-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{alert.company}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-semibold text-gray-100">{alert.symbol}</span>
                  <span className="text-sm text-gray-500">{alert.alertName}</span>
                </div>
              </div>
              <span className="rounded-full px-3 py-1 text-xs font-semibold bg-gray-800 border border-gray-700 text-gray-200">
                {alert.alertType === 'upper' ? 'Price >' : 'Price <'} {formatPrice(alert.threshold)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <span>Live</span>
                {alert.currentPrice !== undefined ? (
                  <span className="text-gray-100 font-semibold">{formatPrice(alert.currentPrice)}</span>
                ) : (
                  <span className="text-gray-600">--</span>
                )}
                {typeof alert.changePercent === 'number' && (
                  <span className={`${getChangeColorClass(alert.changePercent)} font-semibold`}>
                    {alert.changePercent > 0 ? '+' : ''}
                    {alert.changePercent.toFixed(2)}%
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDelete(alert.id)}
                  className="px-3 py-1 rounded-lg border border-red-500/40 text-red-300 hover:border-red-500 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

