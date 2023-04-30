const { normalizeURL } = require("./crawl");

const { test, expect } = require("@jest/globals");

test("normalizeURL strip protocol", () => {
  const input = "https://blog.boot.dev/path";
  const actual = normalizeURL(input);

  const expected = "blog.boot.dev/path";

  expect(actual).toEqual(expected);
});

test("normalizeURL strip trailing slash", () => {
  const input = "https://blog.boot.dev/path/";
  const actual = normalizeURL(input);

  const expected = "blog.boot.dev/path";

  expect(actual).toEqual(expected);
});
