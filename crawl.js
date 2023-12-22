const { JSDOM } = require("jsdom");
const fetch = require("node-fetch");
const path = require("path");
const fs = require("fs").promises;
const puppeteer = require("puppeteer");

// List of common user-agents
const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:42.0) Gecko/20100101 Firefox/42.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 OPR/82.0.4227.42 ",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36 Edg/97.0.1072.76",
];

let n = 0;

// Function to crawl a page and return a dictionary of visited pages.
async function crawlPage(baseURL, currentURL, visitedPages = {}) {
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
    const htmlBody = await fetchWithPuppeteer(currentURL); // Use Puppeteer for fetching

    // =====To get info for specific tag from the site=====

    // const extractedContent = extractTextFromTags(htmlBody, [
    //   "h1",
    //   "h2",
    //   "h3",
    //   "h4",
    //   "h5",
    //   "p",
    //   "a",
    //   "div",
    //   "span",
    // ]);

    const allURLs = getURLsFromHTML(htmlBody, baseURL);
    await saveToFile(`./data/${baseURLObj.hostname}_${n++}.txt`, allURLs);

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
    await fs.appendFile(filePath, content, "utf-8"); // Specify encoding as 'utf-8'
    console.log(`✓ Content saved to ${filePath}`);
  } catch (error) {
    console.error(`𐄂 Error saving to file ${filePath}: ${error.message}\n`);
  }
}

// TODO: Function to extract text from specified HTML tags (Feature)
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

// headless browser function
async function fetchWithPuppeteer(url) {
  const browser = await puppeteer.launch({
    headless: "new",
  });

  const page = await browser.newPage();
  await page.setUserAgent(getRandomUserAgent());
  await page.goto(url);

  const content = await page.content();

  await browser.close();
  return content;
}

function getRandomUserAgent() {
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage,
};
