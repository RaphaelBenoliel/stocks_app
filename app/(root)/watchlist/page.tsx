// app/(root)/watchlist/page.tsx
import { auth } from '@/lib/better-auth/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { getWatchlistSymbols } from '@/lib/actions/watchlist.actions';
import { getStockDataForSymbols } from '@/lib/actions/finnhub.actions';
import WatchlistTable from '@/components/WatchlistTable';

const WatchlistPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect('/sign-in');

  const userId = (session.user.id as string) || (session.user.email as string);
  const symbols = await getWatchlistSymbols(userId);

  if (!symbols?.length) {
    return (
      <div className="watchlist-empty-container">
        <h1 className="watchlist-title">Your Watchlist</h1>
        <p className="watchlist-empty">Your watchlist is empty. Use the search to add stocks to your watchlist.</p>
      </div>
    );
  }

  const stocks = await getStockDataForSymbols(symbols);
  const clientStocks = stocks.map((s) => ({ ...s, addedAt: s.addedAt ? String(s.addedAt) : undefined }));

  return (
    <div className="watchlist-container">
      <h1 className="watchlist-title">Your Watchlist</h1>
      <div className="watchlist-table">
        <WatchlistTable watchlist={clientStocks} />
      </div>
    </div>
  );
};

export default WatchlistPage;
