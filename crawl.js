const { JSDOM } = require("jsdom");
const fetch = require("node-fetch"); // Import node-fetch

async function crawlPage(currentURL) {
  console.log(`⚡ Crawling ${currentURL}`);

  try {
    const resp = await fetch(currentURL);
    const contentType = resp.headers.get("content-type");
    if (!contentType.includes("text/html")) {
      console.log(
        `No HTML response,\n content-type:${contentType},\n on-page: ${currentURL}\n`,
      );
      return;
    }
    if (!resp.ok) {
      throw new Error(
        `× Failed to fetch ${currentURL},\n status: ${resp.status}\n`,
      );

      return;
    }

    const htmlBody = await resp.text(); // Using await to get the text content
    console.log(htmlBody);
    console.log("✓ Crawling completed.");
  } catch (error) {
    console.error(`𐄂 Error fetching ${currentURL}: ${error.message}\n`);
  }
}

function getURLsFromHTML(htmlBody, baseUrl) {
  const urls = [];

  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll("a");

  for (const linkElement of linkElements) {
    if (linkElement.href.slice(0, 1) === "/") {
      // It's a relative URL
      try {
        const urlObj = new URL(`${baseUrl}${linkElement.href}`);
        urls.push(urlObj.href);
      } catch (err) {
        console.log(`Error with relative URL: ${err.message}`);
      }
    } else {
      // It's an absolute URL
      try {
        const urlObj = new URL(linkElement.href);
        urls.push(urlObj.href);
      } catch (err) {
        console.log(`Error with absolute URL: ${err.message}`);
      }
    }
  }
  return urls;
}

function normalizeURL(urlString) {
  const urlObj = new URL(urlString);
  const hostPath = `${urlObj.hostname}${urlObj.pathname}`;
  if (hostPath.length > 0 && hostPath.slice(-1) === "/") {
    return hostPath.slice(0, -1);
  }
  return hostPath;
}

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage,
};
