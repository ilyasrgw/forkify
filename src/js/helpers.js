import { async } from 'regenerator-runtime';

import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const AJAX = async function (
  url,
  uploadData = undefined,
  contentType = 'application/json'
) {
  try {
    let fetchPro;

    if (uploadData) {
      if (contentType === 'application/x-www-form-urlencoded') {
        // Convert the data to URL-encoded form
        const formBody = Object.keys(uploadData)
          .map(
            key =>
              `${encodeURIComponent(key)}=${encodeURIComponent(
                uploadData[key]
              )}`
          )
          .join('&');

        fetchPro = fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formBody,
        });
      } else {
        fetchPro = fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        });
      }
    } else {
      fetchPro = fetch(url);
    }

    const response = await fetchPro;

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error during AJAX request:', error);
    throw error; // rethrow to handle elsewhere if needed
  }
};

/*
export const getJSON = async function (url) {
  try {
    const fetchPro = fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};
*/
