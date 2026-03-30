"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Loader from "@/components/ui/loader";

function NavigationLoaderInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true); // Start as true for initial load

  useEffect(() => {
    // Show loader on mount or on page change
    setLoading(true);
    
    // Minimum 2-second delay as requested
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return (
    <>
      {loading ? <div className="fixed inset-0 z-50 flex items-center justify-center bg-white"><Loader /></div> : children}
    </>
  );
}

// Wrap in Suspense because searchParams requires it inside a client component
export function NavigationLoader({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <NavigationLoaderInner>{children}</NavigationLoaderInner>
    </Suspense>
  );
}
