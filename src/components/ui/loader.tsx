"use client";

import React from "react";

const Loader = () => {
  const dots = [
    { color: "bg-[#9a3ff2]", delay: "0ms" },
    { color: "bg-[#ff4fa3]", delay: "140ms" },
    { color: "bg-[#45aaf2]", delay: "280ms" },
  ];

  return (
    <div
      className="fixed inset-0 z-[9999] flex cursor-wait items-center justify-center bg-white/45 backdrop-blur-[3px] dark:bg-black/45"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="flex items-center gap-5">
        {dots.map((dot, index) => (
          <span
            key={index}
            className={`h-5 w-5 rounded-full ${dot.color}`}
            style={{
              animation: "loader-dot 0.9s ease-in-out infinite",
              animationDelay: dot.delay,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes loader-dot {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.78;
          }
          50% {
            transform: translateY(-8px);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
