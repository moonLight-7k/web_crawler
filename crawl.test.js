const { normalizeURL } = require("./crawl.js");
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
