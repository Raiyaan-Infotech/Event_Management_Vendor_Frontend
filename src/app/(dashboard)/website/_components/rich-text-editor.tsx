"use client";

import { RichTextEditor as BaseRichTextEditor } from "@/components/ui/rich-text-editor";
import { cn } from "@/lib/utils";

interface WebsiteRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  height?: string | number;
  readOnly?: boolean;
  showWordCount?: boolean;
  showCharCount?: boolean;
  maxChars?: number;
  className?: string;
}

function htmlToPlainText(value: string) {
  return value
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export function WebsiteRichTextEditor({
  value,
  onChange,
  label,
  placeholder = "Start writing your content...",
  height = "260px",
  readOnly = false,
  showWordCount = true,
  showCharCount = true,
  maxChars,
  className,
}: WebsiteRichTextEditorProps) {
  const plainText = htmlToPlainText(value);
  const wordCount = plainText ? plainText.split(/\s+/).length : 0;
  const charCount = plainText.length;

  return (
    <div className={cn("space-y-2", className)}>
      {label ? (
        <label className="text-[12px] font-black text-[var(--vendor-text)]">{label}</label>
      ) : null}

      <div className="overflow-hidden rounded-[var(--vendor-radius-panel)] border border-[var(--vendor-border)] bg-[var(--vendor-panel-bg)] shadow-xs">
        <BaseRichTextEditor
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          height={height}
          readOnly={readOnly}
        />
        {(showWordCount || showCharCount) ? (
          <div className="flex items-center justify-between border-t border-[var(--vendor-border)] px-3 py-2 text-[11px] font-semibold text-[var(--vendor-text-muted)]">
            <span>div › p</span>
            <span className="flex items-center gap-3">
              {showWordCount ? <span>Words: {wordCount}</span> : null}
              {showCharCount ? (
                <span>
                  {charCount}
                  {maxChars ? `/${maxChars}` : ""} chars
                </span>
              ) : null}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
