/**
 * Icon name normalization from Iconify v1 legacy format to v2+ format.
 * Dual-mode: works as a browser global and Node.js module.
 */

/**
 * Normalize icon name from legacy Iconify v1 format (prefix-name) to v2+
 * format (prefix:name). If the name already contains ":", it is returned
 * as-is to support the modern format directly.
 * TODO: Remove this backwards-compatibility function after a suitable deprecation period (so maybe in 2028).
 * @param {string} name - The icon name to normalize
 * @returns {string} Normalized icon name with ":" separator
 */
const normalizeIconName = (name) => {
  if (name.includes(":")) return name;
  const dashIndex = name.indexOf("-");
  if (dashIndex > 0) {
    const converted = `${name.substring(0, dashIndex)}:${name.substring(dashIndex + 1)}`;
    // eslint-disable-next-line no-console
    console.warn(`[CALEXT2] Deprecated icon name format "${name}" — use "${converted}" instead (prefix:name).`);
    return converted;
  }
  return name;
};

const IconHelpers = {normalizeIconName};

if (typeof module !== "undefined" && module.exports) {
  module.exports = IconHelpers;
}
