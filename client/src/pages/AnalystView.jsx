import React from "react";

const AnalystView = () => {
  return (
    <div className="flex flex-col h-full space-y-6 bg-white p-6 rounded-2xl shadow-sm">
      
      {/* HEADER */}
      <div className="flex flex-col gap-1 border-b pb-6">
        <h1 className="text-2xl font-semibold text-gray-900 ">
          Analyst View
        </h1>
        <p className="text-sm text-gray-500">
          Market insights and analytics
        </p>
      </div>

      {/* CONTENT CARD */}
      <div className="flex-1 bg-white rounded-2xl shadow-sm border overflow-hidden">
        
        {/* OPTIONAL TOP BAR */}
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
          <span className="text-sm font-medium text-gray-600">
            Live Market Analysis
          </span>

          <a
            href="https://site.recognia.com/exness/serve.shtml?tkn=wzLzw2V3WDjh5FSRJDmsLQoroLERnAgHZVb5bs0GTeAy24jilHKEh%2FLYHp4D2BCF8KYuvQ%2Bbhv5wmkK08pjoY0aegOxl1eTsBdfUVUU4RJk9bmmK2SnYDgq%2BaJiVF%2B7sHWel2nm4ezRs8CvzwyiT388eZRnaOWiGDGIXA4FKFQSi51y%2FTZKkYh7CmHEzIu%2BAQUCBSUzQH8vy3wNV7mGpiw%3D%3D"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-blue-600 hover:underline"
          >
            Open full view ↗
          </a>
        </div>

        {/* IFRAME */}
        <iframe
          src="https://site.recognia.com/exness/serve.shtml?tkn=wzLzw2V3WDjh5FSRJDmsLQoroLERnAgHZVb5bs0GTeAy24jilHKEh%2FLYHp4D2BCF8KYuvQ%2Bbhv5wmkK08pjoY0aegOxl1eTsBdfUVUU4RJk9bmmK2SnYDgq%2BaJiVF%2B7sHWel2nm4ezRs8CvzwyiT388eZRnaOWiGDGIXA4FKFQSi51y%2FTZKkYh7CmHEzIu%2BAQUCBSUzQH8vy3wNV7mGpiw%3D%3D"
          title="Analyst View"
          className="w-full h-[75vh]"
          frameBorder="0"
        />
      </div>
    </div>
  );
};

export default AnalystView;