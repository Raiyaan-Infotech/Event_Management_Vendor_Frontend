import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPublicApiBaseUrl(): string {
  const configured = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api/v1';
  const trimmed = configured.replace(/\/+$/, '');
  return trimmed.endsWith('/api/v1') ? trimmed : `${trimmed}/api/v1`;
}

export function getBackendOrigin(): string {
  return getPublicApiBaseUrl().replace(/\/api\/v1$/, '');
}

export function publicApiUrl(path: string): string {
  return `${getPublicApiBaseUrl()}/${path.replace(/^\/+/, '')}`;
}

export function toPublicSlug(value: string): string {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
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

// ── Status toggle ───────────────────────────────────────────────────────────
// Standard onStatusToggle handler for CommonTable.
// Usage: onStatusToggle={makeStatusToggle(updateMutation)}
export function makeStatusToggle<T extends { id: number }>(
  mutate: (args: { id: number; data: { is_active: number } }) => void
) {
  return (row: T, val: boolean) => mutate({ id: row.id, data: { is_active: val ? 1 : 0 } });
}

// ── Pagination ──────────────────────────────────────────────────────────────
// Backend returns { total, page, limit, totalPages }.
// TablePagination needs { totalItems, hasNextPage, hasPrevPage, limit }.
export function normalizePagination(
  raw: any,
  page: number,
  limit: number
) {
  if (!raw) return null;
  const total      = raw.total ?? raw.totalItems ?? 0;
  const totalPages = raw.totalPages ?? Math.ceil(total / limit);
  return {
    page,
    totalItems:  total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
    limit,
  };
}

// ── Row normalizer ──────────────────────────────────────────────────────────
// CommonTable reads `row.created_at` (snake_case) but Sequelize returns
// `createdAt` (camelCase). Call this before passing rows to CommonTable.
export function normalizeRows<T extends Record<string, any>>(rows: T[]): T[] {
  return rows.map((r) => ({
    ...r,
    created_at: r.created_at ?? r.createdAt ?? "",
  }));
}
