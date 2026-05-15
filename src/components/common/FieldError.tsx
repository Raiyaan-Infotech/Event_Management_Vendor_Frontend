/**
 * Inline field validation error — replaces scattered
 * `{error && <p className="text-sm text-red-600">...</p>}` patterns.
 *
 * Usage:  <FieldError msg={errors.mobile} />
 */
export function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1 text-xs font-medium text-destructive">{msg}</p>;
}
