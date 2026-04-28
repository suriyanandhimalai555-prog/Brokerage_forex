import React, { useState } from "react";

const MarketNews = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="flex flex-col h-full space-y-6 bg-white rounded-2xl shadow-sm p-6">
      
      {/* HEADER */}
      <div className="border-b pb-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Market News
        </h1>
        <p className="text-sm text-gray-500">
          Latest forex and crypto news
        </p>
      </div>

      {/* CARD */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border overflow-hidden relative">

        {/* TOP BAR */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
          <span className="text-sm font-medium text-gray-600">
            Live News Feed
          </span>

          <a
            href="https://my.ex-markets.pro/pa/analytics-widgets/fxstreet-news-interlayer.html"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-blue-600 hover:underline"
          >
            Open full view ↗
          </a>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <div className="animate-pulse text-sm text-gray-500">
              Loading news...
            </div>
          </div>
        )}

        {/* IFRAME */}
        <iframe
          src="https://my.ex-markets.pro/pa/analytics-widgets/fxstreet-news-interlayer.html"
          title="Market News"
          className="w-full h-[75vh]"
          frameBorder="0"
          onLoad={() => setLoading(false)}
        />
      </div>
    </div>
  );
};

export default MarketNews;