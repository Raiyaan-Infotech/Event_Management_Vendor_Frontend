"use client";

import React from "react";
import { normalizeVendorLoaderColors } from "@/lib/vendor-loader-colors";

interface LoaderProps {
  dotColors?: Array<string | null | undefined>;
  label?: string;
}

const Loader = ({ dotColors, label = "Loading" }: LoaderProps) => {
  const normalizedColors = normalizeVendorLoaderColors(dotColors);

  if (!normalizedColors) return null;

  const dots = normalizedColors.map((color, index) => ({
    color,
    delay: `${index * 120}ms`,
  }));

  return (
    <div
      className="fixed inset-0 z-[9999] flex cursor-wait items-center justify-center bg-white/45 backdrop-blur-[3px] dark:bg-black/45"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="flex items-center gap-4 text-slate-400 dark:text-slate-500">
        {dots.map((dot, index) => (
          <span
            key={index}
            className="loader-dot h-5 w-5 rounded-full border border-black/10 bg-current shadow-sm dark:border-white/10"
            style={{
              backgroundColor: dot.color || undefined,
              "--loader-dot-delay": dot.delay,
            } as React.CSSProperties}
          />
        ))}
      </div>

      <style>{`
        .loader-dot {
          animation: loader-dot 0.95s ease-in-out infinite;
          animation-delay: var(--loader-dot-delay, 0ms);
        }

        @keyframes loader-dot {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;
