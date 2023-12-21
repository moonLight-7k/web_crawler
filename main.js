const { crawlPage } = require("./crawl.js");

async function main() {
  if (process.argv.length !== 3) {
    console.error("Usage: node main.js <website>");
    process.exit(1);
  }

  const baseUrl = process.argv[2];

  console.log(`✓ Starting crawler for ${baseUrl}....`);

  // Call the crawlPage function with the provided baseUrl
  await crawlPage(baseUrl);

  console.log("✓ Crawling completed.");
}

// Run the main function
main();
