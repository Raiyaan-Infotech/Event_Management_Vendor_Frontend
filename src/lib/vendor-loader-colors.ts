const DOT_COUNT = 6;

const normalizeVendorLoaderColor = (
  color?: string | null,
) => {
  const normalized = typeof color === "string" ? color.trim() : "";
  return normalized || null;
};

export const normalizeVendorLoaderColors = (
  colors?: Array<string | null | undefined>,
) => {
  if (!colors || colors.length < DOT_COUNT) return null;
  const normalized = colors
    .slice(0, DOT_COUNT)
    .map((color) => normalizeVendorLoaderColor(color));

  return normalized.every(Boolean) ? normalized : null;
};
