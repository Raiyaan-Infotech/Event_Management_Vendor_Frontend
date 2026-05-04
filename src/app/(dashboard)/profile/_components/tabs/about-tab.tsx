'use client';

import { useVendorMe } from '@/hooks/use-vendors';
import { sanitizeHtml } from '@/lib/sanitize-html';

function decodeBasicHtmlEntities(value: string) {
  return value
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&amp;/gi, '&')
    .replace(/&nbsp;/gi, ' ');
}

export function AboutTab() {
  const { data: vendor } = useVendorMe();
  const rawAbout = vendor?.about_us || '';
  const normalizedAbout = decodeBasicHtmlEntities(rawAbout).trim();
  const safeAboutMarkup = sanitizeHtml(normalizedAbout);
  
  return (
    <div className="animate-in fade-in duration-300">
      <h6 className="text-foreground text-[16px] font-bold uppercase mb-5">About</h6>
      {normalizedAbout ? (
        <div
          className="prose prose-sm max-w-none text-muted-foreground leading-[2] mb-10 prose-p:text-muted-foreground prose-headings:text-foreground"
          dangerouslySetInnerHTML={{ __html: safeAboutMarkup }}
        />
      ) : (
        <p className="text-muted-foreground text-[14px] leading-[2] mb-10 italic">
          No description provided yet.
        </p>
      )}

    </div>
  );
}
