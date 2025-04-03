/**
 * Validates the given data object to ensure it meets the required structure and conditions.
 *
 * @param {Record<string, any>} data - The data object to validate.
 * @return {boolean} Returns true if the data contains a valid non-empty string `url`, otherwise false.
 */
export default function validateData(data: Record<string, any>): boolean {
  if (typeof data !== 'object' || data === null) {
    return false;
  }
  const { url } = data as { url: unknown };
  return typeof url === 'string' && url.trim().length > 0;
}
