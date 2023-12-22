const { JSDOM } = require("jsdom");
const fetch = require("node-fetch");
const fs = require("fs").promises;

// Function to crawl a page and return a dictionary of visited pages.
async function crawlPage(
  baseURL,
  currentURL,
  visitedPages = {},
  outputFilePath
) {
  const baseURLObj = new URL(baseURL);
  const currentURLObj = new URL(currentURL);

  if (baseURLObj.hostname !== currentURLObj.hostname) {
    return visitedPages;
  }

  const normalizedCurrentURL = normalizeURL(currentURL);
  if (visitedPages[normalizedCurrentURL] > 0) {
    visitedPages[normalizedCurrentURL]++;
    return visitedPages;
  }
  visitedPages[normalizedCurrentURL] = 1;

  console.log(`⚡ Crawling ${currentURL}`);

  try {
    const resp = await fetch(currentURL);
    const contentType = resp.headers.get("content-type");

    // Not HTML
    if (!contentType.includes("text/html")) {
      console.log(
        `No HTML response,\n content-type:${contentType},\n on-page: ${currentURL}\n`
      );
      return visitedPages;
    }

    // Not OK
    if (!resp.ok) {
      throw new Error(
        `× Failed to fetch ${currentURL},\n status: ${resp.status}\n`
      );
    }
    console.log("✓ Crawling completed. \n");

    const htmlBody = await resp.text(); // Using await to get the text content
    const extractedContent = extractTextFromTags(htmlBody, [
      "h1",
      "h2",
      "h3",
      "p",
    ]);
    await saveToFile(outputFilePath, extractedContent);

    const nextURLs = getURLsFromHTML(htmlBody, baseURL); // Get all URLs from the HTML body

    for (const nextURL of nextURLs) {
      visitedPages = await crawlPage(baseURL, nextURL, visitedPages);
    }
  } catch (error) {
    // Error fetching the page
    throw new Error(`𐄂 Error fetching ${currentURL}: ${error.message}\n`);
  }

  return visitedPages;
}

// Function to get all URLs from an HTML body.
function getURLsFromHTML(htmlBody, baseURL) {
  const urls = [];

  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll("a");

  for (const linkElement of linkElements) {
    if (linkElement.href.slice(0, 1) === "/") {
      // For relative URL
      try {
        const urlObj = new URL(`${baseURL}${linkElement.href}`);
        urls.push(urlObj.href);
      } catch (err) {
        console.error(`Error with relative URL: ${err.message}`);
      }
    } else {
      // For absolute URL
      try {
        const urlObj = new URL(linkElement.href);
        urls.push(urlObj.href);
      } catch (err) {
        console.error(`Error with absolute URL: ${err.message}`);
      }
    }
  }

  return urls;
}

// Function to normalize a URL.
function normalizeURL(urlString) {
  const urlObj = new URL(urlString);
  const hostPath = `${urlObj.hostname}${urlObj.pathname}`;

  // Remove trailing slash
  if (hostPath.length > 0 && hostPath.slice(-1) === "/") {
    return hostPath.slice(0, -1);
  }
  return hostPath;
}

// Function to save content to a file
async function saveToFile(filePath, content) {
  try {
    await fs.writeFile(filePath, content, "utf-8"); // Specify encoding as 'utf-8'
    console.log(`✓ Content saved to ${filePath}`);
  } catch (error) {
    console.error(`𐄂 Error saving to file ${filePath}: ${error.message}\n`);
  }
}

// Function to extract text from specified HTML tags
function extractTextFromTags(htmlBody, tags) {
  const dom = new JSDOM(htmlBody);
  let extractedText = "";

  tags.forEach((tag) => {
    const tagElements = dom.window.document.querySelectorAll(tag);
    tagElements.forEach((element) => {
      extractedText += element.textContent + "\n";
    });
  });

  return extractedText;
}

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage,
};
