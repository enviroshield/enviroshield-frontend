/**
 * String formatting helpers (capitalization, slug formatting, status prettifying).
 */

/**
 * Capitalizes the first letter of each word in a string, replacing underscores and dashes with spaces.
 * e.g. "pending_payment" -> "Pending Payment"
 * e.g. "in-progress" -> "In Progress"
 */
export function formatStatus(status: string, fallback = "—"): string {
  if (!status) return fallback;
  return status
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

/**
 * Capitalizes only the very first letter of a sentence or string.
 * e.g. "hello world" -> "Hello world"
 */
export function capitalize(value: string, fallback = ""): string {
  if (!value) return fallback;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Generates clean, human-readable alt text from an uploaded file name.
 * e.g. "enviroshield-pure-silk.png" -> "Enviroshield Pure Silk"
 * e.g. "waterproofing_coating_bucket.jpg" -> "Waterproofing Coating Bucket"
 */
export function formatAltFromFileName(filename?: string, fallback = ""): string {
  if (!filename) return fallback;
  const withoutExt = filename.replace(/\.[a-zA-Z0-9]+$/, "").trim();
  const cleaned = withoutExt.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();
  if (!cleaned) return fallback;
  return cleaned.replace(/\b\w/g, (char) => char.toUpperCase());
}

