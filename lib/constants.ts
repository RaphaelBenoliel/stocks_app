export const NAV_ITEMS = [
  { href: '/', label: 'Dashboard' },
  { href: '/search', label: 'Search' },
  { href: '/watchlist', label: 'Watchlist' },
  { href: '/alerts', label: 'Alerts' },
  { href: '/news', label: 'News' },
];

export const CHART_BASE_URL = 'https://s3.tradingview.com/external-embedding/embed-widget'

// Sign-up form select options
export const INVESTMENT_GOALS = [
  { value: 'Growth', label: 'Growth' },
  { value: 'Income', label: 'Income' },
  { value: 'Balanced', label: 'Balanced' },
  { value: 'Conservative', label: 'Conservative' },
];

export const RISK_TOLERANCE_OPTIONS = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
];

export const PREFERRED_INDUSTRIES = [
  { value: 'Technology', label: 'Technology' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Energy', label: 'Energy' },
  { value: 'Consumer Goods', label: 'Consumer Goods' },
];

export const ALERT_TYPE_OPTIONS = [
  { value: 'upper', label: 'Upper' },
  { value: 'lower', label: 'Lower' },
];

export const CONDITION_OPTIONS = [
  { value: 'greater', label: 'Greater than (>)' },
  { value: 'less', label: 'Less than (<)' },
];

// TradingView Charts
export const MARKET_OVERVIEW_WIDGET_CONFIG = {
  colorTheme: 'dark', // dark mode
  dateRange: '12M', // last 12 months
  locale: 'en', // language
  largeChartUrl: '', // link to a large chart if needed
  isTransparent: true, // makes background transparent
  showFloatingTooltip: true, // show tooltip on hover
  plotLineColorGrowing: '#0FEDBE', // line color when price goes up
  plotLineColorFalling: '#0FEDBE', // line color when price falls
  gridLineColor: 'rgba(240, 243, 250, 0)', // grid line color
  scaleFontColor: '#DBDBDB', // font color for scale
  belowLineFillColorGrowing: 'rgba(41, 98, 255, 0.12)', // fill under line when growing
  belowLineFillColorFalling: 'rgba(41, 98, 255, 0.12)', // fill under line when falling
  belowLineFillColorGrowingBottom: 'rgba(41, 98, 255, 0)',
  belowLineFillColorFallingBottom: 'rgba(41, 98, 255, 0)',
  symbolActiveColor: 'rgba(15, 237, 190, 0.05)', // highlight color for active symbol
  tabs: [
     {
      title: 'Indexes',
      symbols: [
        { s: 'FOREXCOM:SPXUSD', d: 'S&P 500' },
        { s: 'FOREXCOM:NSXUSD', d: 'Nasdaq 100' },
        { s: 'FOREXCOM:DJI', d: 'Dow 30' },
        { s: 'CAPITALCOM:VIX', d: 'S&P500 Volatility Index' },
        { s: 'INDEX:DXY', d: 'US Dollar Index' },
        { s: 'AMEX:VOO', d: 'Vanguard S&P 500 ETF' },
        { s: 'AMEX:SPY', d: 'SPDR S&P 500 ETF Trust' },
        { s: 'NASDAQ:QQQ', d: 'Invesco QQQ Trust Series I' },
      ],
    },
      {
      title: 'Tech',
      symbols: [
        { s: 'NASDAQ:NVDA', d: 'NVIDIA Corporation' },
        {s: 'NASDAQ:AMD', d: 'Advanced Micro Devices' },
        { s: 'NASDAQ:AMZN', d: 'Amazon.com Inc.' },
        { s: 'NASDAQ:AAPL', d: 'Apple' },
        { s: 'NASDAQ:GOOGL', d: 'Alphabet' },
        { s: 'NASDAQ:MSFT', d: 'Microsoft' },
        { s: 'NASDAQ:META', d: 'Meta Platforms' },
        { s: 'NASDAQ:TSLA', d: 'Tesla Inc' },
        { s: 'NYSE:ORCL', d: 'Oracle Corp' },
        { s: 'NASDAQ:AVGO', d: 'Broadcom Inc' },
        { s: 'NASDAQ:INTC', d: 'Intel Corp' },
      ],
    },
    {
      title: 'Financial',
      symbols: [
        { s: 'NYSE:JPM', d: 'JPMorgan Chase' },
        { s: 'NYSE:WFC', d: 'Wells Fargo Co New' },
        { s: 'NYSE:BAC', d: 'Bank Amer Corp' },
        { s: 'NYSE:HSBC', d: 'Hsbc Hldgs Plc' },
        { s: 'NYSE:C', d: 'Citigroup Inc' },
        { s: 'NYSE:MA', d: 'Mastercard Incorporated' },
      ],
    },
  
    {
      title: 'Services',
      symbols: [
        { s: 'NASDAQ:AMZN', d: 'Amazon' },
        { s: 'NYSE:BABA', d: 'Alibaba Group Hldg Ltd' },
        { s: 'NYSE:T', d: 'At&t Inc' },
        { s: 'NYSE:WMT', d: 'Walmart' },
        { s: 'NYSE:V', d: 'Visa' },
      ],
    },
     {
      title: 'Energy',
      symbols: [
        { s: 'AMEX:XLE', d: 'The Energy Select Sector SPDR Fund' },
        { s: 'NASDAQ:NNE', d: 'Nano Nuclear Energy Inc.' },
        { s: 'NYSE:OKLO', d: 'OKLO Inc' },
        { s: 'NYSE:SMR', d: 'NuScale Power Corporation' },
      ],
    },
  ],
  support_host: 'https://www.tradingview.com', // TradingView host
  backgroundColor: '#141414', // background color
  width: '100%', // full width
  height: 600, // height in px
  showSymbolLogo: true, // show logo next to symbols
  showChart: true, // display mini chart
};

export const HEATMAP_WIDGET_CONFIG = {
  dataSource: 'SPX500',
  blockSize: 'market_cap_basic',
  blockColor: 'change',
  grouping: 'sector',
  isTransparent: true,
  locale: 'en',
  symbolUrl: '',
  colorTheme: 'dark',
  exchanges: [],
  hasTopBar: false,
  isDataSetEnabled: false,
  isZoomEnabled: true,
  hasSymbolTooltip: true,
  isMonoSize: false,
  width: '100%',
  height: '600',
};

export const TOP_STORIES_WIDGET_CONFIG = {
  displayMode: 'regular',
  feedMode: 'market',
  colorTheme: 'dark',
  isTransparent: true,
  locale: 'en',
  market: 'stock',
  width: '100%',
  height: '600',
};

export const MARKET_DATA_WIDGET_CONFIG = {
  title: 'Stocks',
  width: '100%',
  height: 600,
  locale: 'en',
  showSymbolLogo: true,
  colorTheme: 'dark',
  isTransparent: false,
  backgroundColor: '#0F0F0F',
  symbolsGroups: [
    {
      name: 'Technology',
      symbols: [
        { name: 'AAPL', displayName: 'Apple' },
        { name: 'MSFT', displayName: 'Microsoft' },
        { name: 'GOOGL', displayName: 'Alphabet' },
        { name: 'AMZN', displayName: 'Amazon' },
        { name: 'TSLA', displayName: 'Tesla' },
        { name: 'META', displayName: 'Meta Platforms' },
        { name: 'NVDA', displayName: 'NVIDIA Corporation' },
        { name: 'ORCL', displayName: 'Oracle Corp' },
        { name: 'INTC', displayName: 'Intel Corp' },
        { name: 'IBM', displayName: 'International Business Machines' },
        { name: 'ADBE', displayName: 'Adobe Inc.' },
        { name: 'CRM', displayName: 'Salesforce.com' },
        { name: 'CSCO', displayName: 'Cisco Systems' },
        { name: 'AMD', displayName: 'Advanced Micro Devices' },
        { name: 'TXN', displayName: 'Texas Instruments' },
        { name: 'QCOM', displayName: 'Qualcomm Incorporated' },
        { name: 'AVGO', displayName: 'Broadcom Inc' },
        { name: 'NOW', displayName: 'ServiceNow' },
        { name: 'SNOW', displayName: 'Snowflake Inc.' },
        { name: 'ZM', displayName: 'Zoom Video Communications' },
        { name: 'UBER', displayName: 'Uber Technologies' },
        { name: 'LYFT', displayName: 'Lyft Inc' },
        { name: 'DOCU', displayName: 'DocuSign Inc.' },
        { name: 'PTON', displayName: 'Peloton Interactive' },
        
      ],
    },
    {
      name: 'Finance',
      symbols: [
        { name: 'JPM', displayName: 'JPMorgan Chase' },
        { name: 'BAC', displayName: 'Bank of America' },
        { name: 'WFC', displayName: 'Wells Fargo' },
        { name: 'C', displayName: 'Citigroup' },
        { name: 'GS', displayName: 'Goldman Sachs' },
        { name: 'MS', displayName: 'Morgan Stanley' },
        { name: 'AXP', displayName: 'American Express' },
        { name: 'PNC', displayName: 'PNC Financial Services' },
        { name: 'SCHW', displayName: 'The Charles Schwab Corporation' },
        { name: 'BK', displayName: 'The Bank of New York Mellon Corporation' },

      ],
    },
    {
      name: 'Healthcare',
      symbols: [
        { name: 'JNJ', displayName: 'Johnson & Johnson' },
        { name: 'PFE', displayName: 'Pfizer' },
        { name: 'MRK', displayName: 'Merck & Co.' },
        { name: 'ABBV', displayName: 'AbbVie' },
        { name: 'TMO', displayName: 'Thermo Fisher Scientific' },
        { name: 'UNH', displayName: 'UnitedHealth Group' },
        { name: 'LLY', displayName: 'Eli Lilly and Company' },
        { name: 'BMY', displayName: 'Bristol-Myers Squibb' },
        { name: 'AMGN', displayName: 'Amgen' },
        { name: 'GILD', displayName: 'Gilead Sciences' },
      ],
    },
    {
      name: 'Consumer Goods',
      symbols: [
        { name: 'PG', displayName: 'Procter & Gamble' },
        { name: 'KO', displayName: 'Coca-Cola' },
        { name: 'PEP', displayName: 'PepsiCo' },
        { name: 'PM', displayName: 'Philip Morris International' },
        { name: 'UL', displayName: 'Unilever' },
        { name: 'NKE', displayName: 'Nike' },
        { name: 'SBUX', displayName: 'Starbucks' },
        { name: 'MCD', displayName: 'McDonald\'s' },
        { name: 'DIS', displayName: 'The Walt Disney Company' },
        { name: 'V', displayName: 'Visa' },
        { name: 'MA', displayName: 'Mastercard' },
        { name: 'HD', displayName: 'The Home Depot' },
        { name: 'WMT', displayName: 'Walmart' },
        { name: 'COST', displayName: 'Costco Wholesale' },
        { name: 'TGT', displayName: 'Target' },
        { name: 'CVS', displayName: 'CVS Health' },
        { name: 'ABT', displayName: 'Abbott Laboratories' },
      ],
    },
    {
      name: 'Energy',
      symbols: [
        { name: 'XOM', displayName: 'Exxon Mobil' },
        { name: 'CVX', displayName: 'Chevron' },
        { name: 'COP', displayName: 'ConocoPhillips' },
        { name: 'SLB', displayName: 'Schlumberger' },
        { name: 'EOG', displayName: 'EOG Resources' },
        { name: 'AMEX:XLE', displayName: 'The Energy Select Sector SPDR Fund' },
        { name: 'NASDAQ:NNE', displayName: 'Nano Nuclear Energy Inc.' },
        { name: 'NYSE:OKLO', displayName: 'OKLO Inc' },
        { name: 'NYSE:SMR', displayName: 'NuScale Power Corporation' },
        { name: 'HAL', displayName: 'Halliburton'},
        { name: 'MPC', displayName: 'Marathon Petroleum'}
      ],
    }
  ],
};

export const SYMBOL_INFO_WIDGET_CONFIG = (symbol: string) => ({
  symbol: symbol.toUpperCase(),
  colorTheme: 'dark',
  isTransparent: true,
  locale: 'en',
  width: '100%',
  height: 170,
});

export const CANDLE_CHART_WIDGET_CONFIG = (symbol: string) => ({
  allow_symbol_change: false,
  calendar: false,
  details: true,
  hide_side_toolbar: true,
  hide_top_toolbar: false,
  hide_legend: false,
  hide_volume: false,
  hotlist: false,
  interval: 'D',
  locale: 'en',
  save_image: false,
  style: 1,
  symbol: symbol.toUpperCase(),
  theme: 'dark',
  timezone: 'Etc/UTC',
  backgroundColor: '#141414',
  gridColor: '#141414',
  watchlist: [],
  withdateranges: false,
  compareSymbols: [],
  studies: [],
  width: '100%',
  height: 600,
});

export const BASELINE_WIDGET_CONFIG = (symbol: string) => ({
  allow_symbol_change: false,
  calendar: false,
  details: false,
  hide_side_toolbar: true,
  hide_top_toolbar: false,
  hide_legend: false,
  hide_volume: false,
  hotlist: false,
  interval: 'D',
  locale: 'en',
  save_image: false,
  style: 10,
  symbol: symbol.toUpperCase(),
  theme: 'dark',
  timezone: 'Etc/UTC',
  backgroundColor: '#141414',
  gridColor: '#141414',
  watchlist: [],
  withdateranges: false,
  compareSymbols: [],
  studies: [],
  width: '100%',
  height: 600,
});

export const TECHNICAL_ANALYSIS_WIDGET_CONFIG = (symbol: string) => ({
  symbol: symbol.toUpperCase(),
  colorTheme: 'dark',
  isTransparent: 'true',
  locale: 'en',
  width: '100%',
  height: 400,
  interval: '1h',
  largeChartUrl: '',
});

export const COMPANY_PROFILE_WIDGET_CONFIG = (symbol: string) => ({
  symbol: symbol.toUpperCase(),
  colorTheme: 'dark',
  isTransparent: 'true',
  locale: 'en',
  width: '100%',
  height: 440,
});

export const COMPANY_FINANCIALS_WIDGET_CONFIG = (symbol: string) => ({
  symbol: symbol.toUpperCase(),
  colorTheme: 'dark',
  isTransparent: 'true',
  locale: 'en',
  width: '100%',
  height: 464,
  displayMode: 'regular',
  largeChartUrl: '',
});

export const POPULAR_STOCK_SYMBOLS = [
  // Tech Giants (the big technology companies)
  'AAPL',
  'MSFT',
  'GOOGL',
  'AMZN',
  'TSLA',
  'META',
  'NVDA',
  'NFLX',
  'ORCL',
  'CRM',

  // Growing Tech Companies
  'ADBE',
  'INTC',
  'AMD',
  'PYPL',
  'UBER',
  'ZOOM',
  'SPOT',
  'SQ',
  'SHOP',
  'ROKU',

  // Newer Tech Companies
  'SNOW',
  'PLTR',
  'COIN',
  'RBLX',
  'DDOG',
  'CRWD',
  'NET',
  'OKTA',
  'TWLO',
  'ZM',

  // Consumer & Delivery Apps
  'DOCU',
  'PTON',
  'PINS',
  'SNAP',
  'LYFT',
  'DASH',
  'ABNB',
  'RIVN',
  'LCID',
  'NIO',

  // International Companies
  'XPEV',
  'LI',
  'BABA',
  'JD',
  'PDD',
  'TME',
  'BILI',
  'DIDI',
  'GRAB',
  'SE',
];

export const NO_MARKET_NEWS =
  '<p class="mobile-text" style="margin:0 0 20px 0;font-size:16px;line-height:1.6;color:#4b5563;">No market news available today. Please check back tomorrow.</p>';

export const WATCHLIST_TABLE_HEADER = [
  'Company',
  'Symbol',
  'Price',
  'Change',
  'Market Cap',
  'P/E Ratio',
  'Alert',
  'Action',
];