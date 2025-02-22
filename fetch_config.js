import { get } from "http";

/**
 * @param {string} url - The input string to encode.
 * @returns {Promise<string>} - The Base64 encoded string.
 */
export function fetchData(url) {
  return new Promise((resolve, reject) => {
    get(url, (response) => {
      let data = "";
      response.on("data", (chunk) => {
        data += chunk;
      });
      response.on("end", () => {
        resolve(data);
      });
    }).on("error", (err) => {
      reject(err);
    });
  });
}
