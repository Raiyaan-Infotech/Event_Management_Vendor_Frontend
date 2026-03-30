"use client";

import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-opacity duration-300">
      <div className="relative flex flex-col items-center gap-3">
        {/* Spinner */}
        <div className="relative w-10 h-10">
          {/* Light Background Ring (Hardly visible but exists in professional designs) */}
          <div className="absolute inset-0 rounded-full border-[2px] border-blue-50/50"></div>
          {/* Animated Partial Ring (The Target Blue) */}
          <div className="absolute inset-0 rounded-full border-[2px] border-t-[#000000] border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        </div>
        
        {/* Loading Text */}
        <div className="flex flex-col items-center">
          <span className="text-[13px] font-normal text-[#000000]/80 tracking-normal antialiased">
            Loading...
          </span>
        </div>
      </div>
    </div>
  );
};

export default Loader;
