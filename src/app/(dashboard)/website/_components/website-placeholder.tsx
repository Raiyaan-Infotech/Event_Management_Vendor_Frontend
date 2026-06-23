import Link from "next/link";
import { FileText, Home } from "lucide-react";

function EmptyIllustration() {
  return (
    <div className="relative h-48 w-64 shrink-0" aria-hidden="true">
      <div className="absolute left-8 top-4 h-36 w-40 rounded-[40px] bg-[var(--vendor-primary-btn)]/10" />
      <div className="absolute left-14 top-14 h-24 w-32 rounded-lg border border-[var(--vendor-primary-btn)]/15 bg-white shadow-[0_20px_60px_rgba(64,52,255,0.12)]" />
      <div className="absolute left-20 top-2 h-28 w-24 rotate-[7deg] rounded-md bg-white shadow-[0_14px_40px_rgba(64,52,255,0.12)]">
        <div className="mx-4 mt-7 h-2 rounded-full bg-[var(--vendor-primary-btn)]/15" />
        <div className="mx-4 mt-3 h-2 rounded-full bg-[var(--vendor-primary-btn)]/15" />
        <div className="mx-4 mt-3 h-2 w-12 rounded-full bg-[var(--vendor-primary-btn)]/15" />
      </div>
      <div className="absolute bottom-9 left-4 h-16 w-16 rounded-full border-[7px] border-[var(--vendor-primary-btn)]/70" />
      <div className="absolute bottom-7 left-16 h-3 w-16 rotate-45 rounded-full bg-[var(--vendor-primary-btn)]/70" />
      <div className="absolute bottom-12 right-10 h-10 w-10 rounded-full border-[6px] border-white bg-[var(--vendor-primary-btn)]/20 shadow-sm" />
      <div className="absolute bottom-5 left-0 right-0 h-5 rounded-full bg-[var(--vendor-primary-btn)]/5 blur-sm" />
      <div className="absolute right-2 top-8 h-2 w-2 rounded-full border border-[var(--vendor-primary-btn)]/20" />
      <div className="absolute left-4 top-1 h-2 w-2 rounded-full border border-[var(--vendor-primary-btn)]/20" />
    </div>
  );
}

export function WebsitePlaceholder() {
  return (
    <div className="flex h-[calc(100vh-86px)] items-center justify-center overflow-y-auto bg-[var(--vendor-page-bg)] px-6 py-10">
      <section className="flex w-full max-w-4xl flex-col items-center justify-center gap-10 md:flex-row md:gap-16">
        <EmptyIllustration />

        <div className="max-w-sm text-center md:text-left">
          <FileText className="mx-auto mb-5 h-10 w-10 text-[var(--vendor-primary-btn)] md:mx-0" />
          <h1 className="text-3xl font-black tracking-normal text-[var(--vendor-text)]">
            No Content Available
          </h1>
          <p className="mt-3 text-sm font-medium leading-6 text-[var(--vendor-text-muted)]">
            There is no content to display at the moment. Please check back later.
          </p>
          <Link
            href="/dashboard"
            className="mt-7 inline-flex h-11 items-center gap-2 rounded-[var(--vendor-radius-control)] bg-[var(--vendor-primary-btn)] px-5 text-sm font-bold text-white shadow-sm transition hover:opacity-90"
          >
            <Home className="h-4 w-4" />
            Go Back Home
          </Link>
        </div>
      </section>
    </div>
  );
}
