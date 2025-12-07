import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/better-auth/auth";
import { getNews } from "@/lib/actions/finnhub.actions";
import { formatTimeAgo } from "@/lib/utils";
import Link from "next/link";
import { NewsSummary } from "@/components/ai/NewsSummary";

const NewsPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/sign-in");

  const articles = await getNews();

  return (
    <section className="container py-10 space-y-6">
      <div className="rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900/80 border border-gray-700/80 px-6 py-8 shadow-xl">
        <p className="text-sm text-yellow-400 font-semibold uppercase tracking-wide mb-2">Market pulse</p>
        <h1 className="text-3xl font-bold text-gray-50 mb-2">Latest stories across the market</h1>
        <p className="text-gray-400 max-w-3xl">
          Curated headlines from major outlets. Add symbols to your watchlist to prioritize company-specific stories.
        </p>
      </div>

      <NewsSummary />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {articles?.length ? (
          articles.map((article) => (
            <article key={article.id} className="news-item">
              <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
                <span className="news-tag">{article.category?.toUpperCase() || "MARKET"}</span>
                <span>{formatTimeAgo(article.datetime)}</span>
                <span className="text-gray-600">•</span>
                <span>{article.source}</span>
              </div>
              <h2 className="news-title">{article.headline}</h2>
              <p className="news-summary">{article.summary}</p>
              <Link
                href={article.url}
                target="_blank"
                rel="noreferrer"
                className="news-cta inline-flex items-center gap-1"
              >
                Read article →
              </Link>
            </article>
          ))
        ) : (
          <div className="col-span-full rounded-2xl border border-gray-700/80 bg-gray-900/60 p-6 text-center text-gray-400">
            <p className="text-lg font-semibold mb-2">No news available</p>
            <p className="text-gray-500">Add your API key in the environment or try again later.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsPage;
