/**
 * Validates the given data object to ensure it is a non-null object.
 *
 * @param {Record<string, any>} data - The data object to validate.
 * @return {boolean} Returns true if the data is a non-null object, otherwise false.
 */
export default function validateData(data: Record<string, any>): boolean {
  return typeof data === 'object' && data !== null;
}
