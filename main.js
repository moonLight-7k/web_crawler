const { crawlPage } = require("./crawl.js");

async function main() {
  if (process.argv.length !== 3) {
    console.error("ⅹ Usage: node main.js <website>");
    process.exit(1);
  }

  const baseUrl = process.argv[2];

  console.log(`✓ Starting crawler for ${baseUrl}....`);

  await crawlPage(baseUrl);
}

main();
