import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/better-auth/auth";
import { getAlerts } from "@/lib/actions/alert.actions";
import { getWatchlist } from "@/lib/actions/watchlist.actions";
import { getStockDataForSymbols } from "@/lib/actions/finnhub.actions";
import { AlertManager } from "@/components/alerts/AlertManager";

const AlertsPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/sign-in");

  const userId = (session.user.id as string) || (session.user.email as string);
  const alerts = await getAlerts(userId);
  const watchlistDocs = await getWatchlist(userId);
  const watchlistOptions = (watchlistDocs || []).map((d) => ({ symbol: d.symbol, company: d.company }));

  const symbols = [...new Set(alerts.map((a) => a.symbol))];
  const priceData = await getStockDataForSymbols(symbols);
  const priceMap = new Map(priceData.map((p) => [p.symbol, p]));

  const alertsWithData = alerts.map((a) => {
    const data = priceMap.get(a.symbol);
    return {
      ...a,
      currentPrice: data?.currentPrice,
      changePercent: data?.changePercent,
    } as Alert & { id: string; currentPrice?: number; changePercent?: number };
  });

  return (
    <section className="container py-10 space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900/80 border border-gray-700/80 px-6 py-8 shadow-xl">
        <p className="text-sm text-yellow-400 font-semibold uppercase tracking-wide mb-2">Signalist Alerts</p>
        <h1 className="text-3xl font-bold text-gray-50 mb-2">Price alerts that keep you in the loop</h1>
        <p className="text-gray-400 max-w-3xl">
          Create upper and lower price triggers for the symbols you track. We will ping you when a target is crossed—no more missed moves.
        </p>
      </div>

      <AlertManager initialAlerts={alertsWithData} watchlist={watchlistOptions} />
    </section>
  );
};

export default AlertsPage;
