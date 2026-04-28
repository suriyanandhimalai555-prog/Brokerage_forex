import React, { useState } from "react";

const EconomicCalendar = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="flex flex-col h-full space-y-6 bg-white p-6 rounded-2xl shadow-sm">
      
      {/* HEADER */}
      <div className="flex flex-col gap-1 border-b pb-4">
        <h1 className="text-2xl font-semibold text-gray-900">
          Economic Calendar
        </h1>
        <p className="text-sm text-gray-500">
          Track global economic events and market impact
        </p>
      </div>

      {/* CARD */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border overflow-hidden relative">

        {/* TOP BAR */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
          <span className="text-sm font-medium text-gray-600">
            Live Economic Events
          </span>

          <a
            href="https://www.exness.com/embeds/tools/calendar/"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-blue-600 hover:underline"
          >
            Open full view ↗
          </a>
        </div>

        {/* LOADING OVERLAY */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <div className="animate-pulse text-sm text-gray-500">
              Loading calendar...
            </div>
          </div>
        )}

        {/* IFRAME */}
        <iframe
          src="https://www.exness.com/embeds/tools/calendar/"
          title="Economic Calendar"
          className="w-full h-[80vh]"
          frameBorder="0"
          onLoad={() => setLoading(false)}
        />
      </div>
    </div>
  );
};

export default EconomicCalendar;