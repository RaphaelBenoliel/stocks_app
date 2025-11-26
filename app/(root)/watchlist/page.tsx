// app/(root)/watchlist/page.tsx
import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getWatchlistSymbols } from '@/lib/actions/watchlist.actions';
import { getStockDataForSymbols } from '@/lib/actions/finnhub.actions';
import WatchlistTable from '@/components/WatchlistTable';
import { WatchlistInsight } from '@/components/ai/WatchlistInsight';

const WatchlistPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect('/sign-in');

  const userId = (session.user.id as string) || (session.user.email as string);
  const symbols = await getWatchlistSymbols(userId);

  if (!symbols?.length) {
    return (
      <section className="container py-10 space-y-6">
        <div className="rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900/80 border border-gray-700/80 px-6 py-8 shadow-xl">
          <p className="text-sm text-yellow-400 mb-2 font-semibold tracking-wide">Signalist Watchlist</p>
          <h1 className="text-3xl font-bold text-gray-50 mb-2">Stay on top of the tickers that matter</h1>
          <p className="text-gray-400 max-w-2xl">
            Add symbols from Search to track live prices, daily changes, and sectors at a glance. Your list is empty for now—start by adding your first company.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="glass-tile">
              <p className="text-sm text-gray-500">Symbols tracked</p>
              <p className="text-2xl font-semibold text-gray-100">0</p>
            </div>
            <div className="glass-tile">
              <p className="text-sm text-gray-500">Avg. move today</p>
              <p className="text-2xl font-semibold text-gray-100">--</p>
            </div>
            <div className="glass-tile">
              <p className="text-sm text-gray-500">Last updated</p>
              <p className="text-2xl font-semibold text-gray-100">Just now</p>
            </div>
          </div>
        </div>
        <div className="watchlist-empty">
          <span className="watchlist-star">☆</span>
          <h2 className="empty-title">No tickers yet</h2>
          <p className="empty-description">
            Use the Search command (⌘/Ctrl + K) to add your first stock. We will display live prices and daily performance here.
          </p>
        </div>
      </section>
    );
  }

  const stocks = await getStockDataForSymbols(symbols);
  const clientStocks = stocks.map((s) => ({ ...s, addedAt: s.addedAt ? String(s.addedAt) : undefined }));

  return (
    <section className="container py-10 space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900/80 border border-gray-700/80 px-6 py-8 shadow-xl flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-sm text-yellow-400 font-semibold uppercase tracking-wide">Signalist Watchlist</p>
          <h1 className="text-3xl font-bold text-gray-50">Your Watchlist</h1>
          <p className="text-gray-400 max-w-3xl">
            Monitor your symbols with live prices, daily performance, and quick edits. Click a row to jump into the detailed view.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 min-w-[240px]">
          <div className="glass-tile">
            <p className="text-sm text-gray-500">Symbols</p>
            <p className="text-2xl font-semibold text-gray-100">{clientStocks.length}</p>
          </div>
          <div className="glass-tile">
            <p className="text-sm text-gray-500">Today’s movers</p>
            <p className="text-2xl font-semibold text-gray-100">
              {clientStocks.filter((s) => typeof s.changePercent === 'number' && s.changePercent !== 0).length}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-700/80 bg-gray-900/60 shadow-2xl p-4 lg:p-6">
        <WatchlistInsight />
        <div className="mt-4">
          <WatchlistTable watchlist={clientStocks} />
        </div>
      </div>
    </section>
  );
};

export default WatchlistPage;
