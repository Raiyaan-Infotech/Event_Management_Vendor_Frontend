import React from "react";
import Loader from "@/components/ui/loader";

export default function RootLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-gray-900 transition-all duration-300">
      <Loader />
    </div>
  );
}
