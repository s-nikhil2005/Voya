/**
 * Optimizes image URLs for frontend rendering without modifying database records.
 * 
 * Requirements satisfied:
 * - Idempotent: If URL already has optimization params, does not duplicate.
 * - Preserves existing query parameters (e.g. tracking, tokens).
 * - Non-Unsplash images are returned untouched.
 * - Relative paths or invalid URLs are returned safely as-is.
 * 
 * @param {string} url - Original image URL
 * @param {number} [width=600] - Target rendering width
 * @param {number} [quality=80] - Compression quality (1-100)
 * @returns {string} Optimized image URL
 */
export const getOptimizedImageUrl = (url, width = 600, quality = 80) => {
  if (!url || typeof url !== "string") return "";

  try {
    const parsed = new URL(url);

    // Only apply Unsplash dynamic CDN parameters to Unsplash images
    if (
      parsed.hostname === "images.unsplash.com" ||
      parsed.hostname.endsWith(".unsplash.com")
    ) {
      if (!parsed.searchParams.has("auto")) {
        parsed.searchParams.set("auto", "format");
      }
      if (!parsed.searchParams.has("fit")) {
        parsed.searchParams.set("fit", "crop");
      }
      if (!parsed.searchParams.has("w")) {
        parsed.searchParams.set("w", String(width));
      }
      if (!parsed.searchParams.has("q")) {
        parsed.searchParams.set("q", String(quality));
      }
      return parsed.toString();
    }

    // Return non-Unsplash absolute URLs unmodified
    return url;
  } catch {
    // Relative paths or malformed URLs return unchanged
    return url;
  }
};
