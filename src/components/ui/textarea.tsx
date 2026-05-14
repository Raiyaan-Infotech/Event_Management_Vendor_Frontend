import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-[var(--vendor-radius-control)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] px-3 py-2 text-[var(--vendor-form-input-text)] text-[var(--vendor-text)] ring-offset-background placeholder:text-[var(--vendor-text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--vendor-primary-btn)]/20 focus-visible:border-[var(--vendor-primary-btn)] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };