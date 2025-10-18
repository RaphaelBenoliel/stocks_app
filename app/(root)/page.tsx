import TradingChart from "@/components/TradingChart";
import { Button } from "@/components/ui/button";
import { CHART_BASE_URL, HEATMAP_WIDGET_CONFIG, MARKET_DATA_WIDGET_CONFIG, MARKET_OVERVIEW_WIDGET_CONFIG, TOP_STORIES_WIDGET_CONFIG } from "@/lib/constants";

export default function Home() {
  return (
    <div className="flex min-h-screen home-wrapper">
      <section className="grid w-full gap-8 home-section">
        <div className="md:col-span-1 xl xl:col-span-1">
          <TradingChart
            title="Market Overview"
            scriptUrl={`${CHART_BASE_URL}-market-overview.js`}
            config={MARKET_OVERVIEW_WIDGET_CONFIG}
            className="custom-chart"
            height={600}
          />
        </div>
        <div className="md:col-span-1 xl:col-span-2">
          <TradingChart
            title="Stock Heatmap"
            scriptUrl={`${CHART_BASE_URL}-stock-heatmap.js`}
            config={HEATMAP_WIDGET_CONFIG}
            className="custom-chart"
            height={600}
          />
        </div>
      </section>
      <section className="grid w-full gap-8 home-section">
        <div className="h-full md:col-span-1 xl xl:col-span-1">
          <TradingChart
            scriptUrl={`${CHART_BASE_URL}-timeline.js`}
            config={TOP_STORIES_WIDGET_CONFIG}
            className="custom-chart"
            height={600}
          />
        </div>
        <div className="h-full md:col-span-1 xl:col-span-2">
          <TradingChart
            scriptUrl={`${CHART_BASE_URL}-market-quotes.js`}
            config={MARKET_DATA_WIDGET_CONFIG}
            height={600}
          />
        </div>
      </section>

    </div>
  );
}