"use client";

import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-[3px] border-gray-100"></div>
          <div 
            className="absolute inset-0 rounded-full border-[3px] border-t-black border-r-transparent border-b-transparent border-l-transparent dark:border-t-white"
            style={{ animation: "spin 0.5s linear infinite" }}
          ></div>
        </div>
        
        {/* Loading Text */}
        <span className="text-[14px] font-medium text-gray-900 dark:text-white tracking-wide antialiased">
          Loading...
        </span>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loader;