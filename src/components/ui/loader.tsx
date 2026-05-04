"use client";

import React from "react";

interface LoaderProps {
  dotColors?: string[];
}

const DEFAULT_DOT_COLORS = [
  "#2563eb",
  "#1d4ed8",
  "#0f172a",
  "#334155",
  "#60a5fa",
  "#93c5fd",
];

const Loader = ({ dotColors }: LoaderProps) => {
  const colors = dotColors && dotColors.length === 6 ? dotColors : DEFAULT_DOT_COLORS;
  const dots = colors.map((color, index) => ({
    color,
    delay: `${index * 120}ms`,
  }));

  return (
    <div
      className="fixed inset-0 z-[9999] flex cursor-wait items-center justify-center bg-white/45 backdrop-blur-[3px] dark:bg-black/45"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <div className="flex items-center gap-4">
        {dots.map((dot, index) => (
          <span
            key={index}
            className="h-5 w-5 rounded-full border border-black/10 shadow-sm dark:border-white/10"
            style={{
              backgroundColor: dot.color,
              animation: "loader-dot 0.95s ease-in-out infinite",
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
