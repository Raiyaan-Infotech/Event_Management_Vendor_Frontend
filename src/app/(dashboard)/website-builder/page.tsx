"use client";

import { useEffect, useState } from "react";

// Opens the separate Website Builder app. The builder lives on a different
// origin, so the vendor login cookie can't be shared directly. We mint a
// short-lived handoff token from the logged-in vendor session and forward to
// the builder's handoff route, which stamps a vendor cookie on the builder's
// own domain so it loads authenticated.
export default function WebsiteBuilderHandoffPage() {
  const [error, setError] = useState(false);

  useEffect(() => {
    const builderOrigin = (
      process.env.NEXT_PUBLIC_WEBSITE_BUILDER_URL || "http://localhost:3005"
    ).replace(/\/+$/, "");

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/proxy/v1/vendors/auth/handoff-token", {
          method: "POST",
          credentials: "include",
        });
        if (!res.ok) throw new Error("handoff-token failed");
        const data = await res.json();
        const token = data?.data?.handoff_token;
        if (!token) throw new Error("no token");
        if (cancelled) return;
        window.location.replace(
          `${builderOrigin}/api/vendor/auth/handoff?token=${encodeURIComponent(token)}`,
        );
      } catch {
        if (!cancelled) setError(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-center">
      {error ? (
        <>
          <p className="text-sm font-medium text-rose-600">
            Could not open the Website Builder.
          </p>
          <p className="text-xs text-slate-500">
            Please make sure you are logged in and try again.
          </p>
        </>
      ) : (
        <>
          <div className="size-8 animate-spin rounded-full border-2 border-slate-300 border-t-[var(--vendor-primary-btn)]" />
          <p className="text-sm text-slate-500">Opening Website Builder…</p>
        </>
      )}
    </div>
  );
}
