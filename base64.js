/**
 *
 * @param {string} base64String
 * @returns {string}
 */
export function base64Decode(base64String) {
  // Create a Buffer from the Base64 string and convert it to a UTF-8 string
  return Buffer.from(base64String, "base64").toString("utf-8");
}
