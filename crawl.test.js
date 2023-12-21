const { normalizeURL, getURLsFromHTML } = require("./crawl.js");
const { test, expect } = require("@jest/globals");

test("normalizeURL strip protocol", () => {
  const input = "https://koursera.netlify.app/home";
  const output = normalizeURL(input);
  const expected = "koursera.netlify.app/home";
  expect(output).toEqual(expected);
});

test("normalizeURL strip trailing slash", () => {
  const input = "https://koursera.netlify.app/home/";
  const output = normalizeURL(input);
  const expected = "koursera.netlify.app/home";
  expect(output).toEqual(expected);
});

test("normalizeURL capitals", () => {
  const input = "https://KOURSERA.netlify.app/home/";
  const output = normalizeURL(input);
  const expected = "koursera.netlify.app/home";
  expect(output).toEqual(expected);
});

test("normalizeURL strip http", () => {
  const input = "http://koursera.netlify.app/home/";
  const output = normalizeURL(input);
  const expected = "koursera.netlify.app/home";
  expect(output).toEqual(expected);
});

test("getURLsFromHTML absolute", () => {
  const inputHTMLBody = `
  <html>
        <body>
              <a href="https://koursera.netlify.app/path"> Click Me </a>
        </body>
  </html>
  `;

  const inputBaseURL = "https://koursera.netlify.app/path";
  const output = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = ["https://koursera.netlify.app/path"];
  expect(output).toEqual(expected);
});

test("getURLsFromHTML relative", () => {
  const inputHTMLBody = `
  <html>
        <body>
              <a href="/path"> Click Me </a>
        </body>
  </html>
  `;

  const inputBaseURL = "https://koursera.netlify.app";
  const output = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = ["https://koursera.netlify.app/path"];
  expect(output).toEqual(expected);
});

test("getURLsFromHTML invalid", () => {
  const inputHTMLBody = `
  <html>
        <body>
              <a href="invalid"> Click Me </a>
        </body>
  </html>
  `;

  const inputBaseURL = "https://koursera.netlify.app";
  const output = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = [];
  expect(output).toEqual(expected);
});
