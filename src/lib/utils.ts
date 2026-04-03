import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function resolveMediaUrl(url: string | null | undefined): string {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) return url;
  
  // If it starts with /api/uploads/, normalize to /uploads/
  let normalizedUrl = url.startsWith('/api/uploads/') 
    ? url.replace('/api/uploads/', '/uploads/') 
    : url;

  // Add leading slash if missing (to match Next.js rewrites)
  if (!normalizedUrl.startsWith('/')) {
    normalizedUrl = '/' + normalizedUrl;
  }

  return normalizedUrl;
}
