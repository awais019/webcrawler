function printReport(pages) {
  console.log("=== Report ===");
  const sortedPages = sortPages(pages);

  for (const sortedPage in sortedPages) {
    console.log(`Found ${sortedPage[0]} links to page: ${sortedPage[1]}`);
  }
  console.log("=== End Report ===");
}

function sortPages(pages) {
  const pagesArr = Object.entries(pages);
  pagesArr.sort((a, b) => {
    const aHits = a[1];
    const bHits = b[1];

    return bHits - aHits;
  });
  return pagesArr;
}

module.exports = {
  sortPages,
  printReport,
};
