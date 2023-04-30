const { JSDOM } = require("jsdom");

async function crawlPage(baseURL, currentURL, pages) {
  const baseURLObj = new URL(baseURL);
  const currentURLObj = new URL(currentURL);

  if (baseURL.hostname != currentURL.hostname) {
    return pages;
  }

  const normalizeCurrentURL = normalizeURL(currentURL);

  if (pages[normalizeCurrentURL] > 0) {
    pages[normalizeCurrentURL]++;
    return pages;
  }

  pages[normalizeCurrentURL] = 1;

  console.log(`Actively Crawling ${currentURL}`);
  try {
    const res = await fetch(currentURL);

    if (res.status > 399) {
      console.log(`Error crawling ${currentURL}: with status ${res.status}`);
      return pages;
    }

    const contentType = res.headers.get("content-type");

    if (!contentType.includes("text/html")) {
      console.log(
        `Error crawling ${currentURL}: with content type ${contentType}`
      );
      return pages;
    }

    const htmlBody = await res.text();

    const nextURLs = getURLsFromHTML(htmlBody, baseURL);
    for (const nextURL of nextURLs) {
      pages = await crawlPage(baseURL, nextURL, pages);
    }
  } catch (error) {
    console.log(`Error crawling ${currentURL}: ${error.message}`);
  }

  return pages;
}

function getURLsFromHTML(htmlBody, baseURL) {
  const urls = [];

  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll("a");

  for (linkElement of linkElements) {
    if (linkElement.href.slice(0, 1) == "/") {
      try {
        const urlObj = new URL(`${baseURL}${linkElement.href}`);
        urls.push(urlObj.href);
      } catch (error) {
        console.log(`Error parsing URL: ${baseURL}${linkElement.href}`);
      }
    } else {
      try {
        const urlObj = new URL(linkElement.href);
        urls.push(urlObj.href);
      } catch (error) {
        console.log(`Error parsing URL: ${baseURL}${linkElement.href}`);
      }
    }
  }
  return urls;
}

function normalizeURL(urlString) {
  const urlObj = new URL(urlString);

  const hostpath = `${urlObj.hostname}${urlObj.pathname}`;

  if (hostpath.length > 0 && hostpath.slice(-1) == "/") {
    return hostpath.slice(0, -1);
  }
  return hostpath;
}

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage,
};
