import { TIMEOUT_SEC } from "./config.js";

/**
 * Creates a promise that rejects after a specified time period.
 * @param {number} seconds - The time in seconds before the promise rejects.
 * @returns {Promise} - A promise that rejects after the specified time.
 */
const timeout = (seconds) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request took too long! Timeout after ${seconds} second`));
    }, seconds * 1000);
  });
};

/**
 * Makes an AJAX request to the specified URL.
 * @param {string} url - The URL to which the request is made.
 * @param {object} uploadData - Data to be uploaded (optional).
 * @returns {Promise<object>} - A promise resolving with the response data.
 */
export const AJAX = async (url, uploadData = undefined) => {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) alert(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    alert(err);
  }
};

/**
 * Renders a spinner inside the specified parent element.
 * @param {HTMLElement} parentElement - The parent element where the spinner will be rendered.
 * @param {string} margin - The margin CSS property for the spinner (optional, default is "auto").
 */
export const renderSpinner = (parentElement, margin = "auto") => {
  const markup = `<div class="spinner" style="margin: ${margin}"></div>`;
  parentElement.innerHTML = markup;
};
