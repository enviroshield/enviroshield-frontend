/**
 * Utility functions for automatic Product & Variant/Stock SKU generation.
 */

/**
 * Cleans a weight or size string into a concise uppercase SKU code.
 * Examples:
 *  - "5 Kg" -> "5KG"
 *  - "20 Kg" -> "20KG"
 *  - "0.96 Ltr" -> "096LTR"
 *  - "3.64 Ltr" -> "364LTR"
 *  - "18.2 Ltr" -> "182LTR"
 *  - "500 ML" -> "500ML"
 */
export function cleanWeightForSku(weightOrSize: string): string {
  if (!weightOrSize || !weightOrSize.trim()) return "";
  const raw = weightOrSize.trim().toUpperCase();

  // Remove decimal points between digits: 0.96 -> 096, 3.64 -> 364
  const withoutDecimals = raw.replace(/(\d+)\.(\d+)/g, "$1$2");

  // Keep only alphanumeric characters
  return withoutDecimals.replace(/[^A-Z0-9]/g, "");
}

/**
 * Automatically generates a clean, readable product SKU from product name.
 * Examples:
 *  - "PureSilk" -> "ENV-PURE-SILK"
 *  - "Enviro PureSilk" -> "ENV-PURE-SILK"
 *  - "AquaShield" -> "ENV-AQUA-SHIELD"
 *  - "RoofGuard Elastomeric Coating" -> "ENV-ROOF-GUARD"
 *  - "DampBlock Wall Protector" -> "ENV-DAMP-BLOCK"
 *  - "Primer" -> "ENV-PRIM"
 */
export function generateProductSku(name: string, prefix = "ENV"): string {
  if (!name || !name.trim()) return "";

  // Split camelCase words and remove symbols
  const normalized = name
    .trim()
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[^a-zA-Z0-9\s]/g, "");

  const allWords = normalized.split(/\s+/).filter(Boolean);
  if (allWords.length === 0) return "";

  // Ignore brand keywords if already present
  const nonBrand = allWords.filter(
    (w) => !/^(enviro|enviroshield)$/i.test(w)
  );
  const words = nonBrand.length > 0 ? nonBrand : allWords;

  const cleanWord = (w: string) => {
    const upper = w.toUpperCase();
    return upper.length <= 6 ? upper : upper.slice(0, 5);
  };

  let code = "";
  if (words.length === 1) {
    code = cleanWord(words[0]);
  } else {
    const w1 = cleanWord(words[0]);
    const w2 = cleanWord(words[1]);
    code = `${w1}-${w2}`;
  }

  return `${prefix}-${code}`.toUpperCase();
}

/**
 * Automatically generates a variant/stock SKU from the product SKU and variant weight.
 * Examples:
 *  - ("ENV-PURE-SILK", "5 Kg") -> "ENV-PURE-SILK-5KG"
 *  - ("ENV-PURE-SILK", "0.96 Ltr") -> "ENV-PURE-SILK-096LTR"
 *  - ("ENV-PURE-SILK", "20 Kg") -> "ENV-PURE-SILK-20KG"
 */
export function generateVariantSku(
  productSku: string,
  weightOrSize: string,
  index = 1
): string {
  const base = (productSku || "ENV").trim().toUpperCase();
  const weightCode = cleanWeightForSku(weightOrSize);

  if (weightCode) {
    return `${base}-${weightCode}`;
  }
  return `${base}-V${index}`;
}
