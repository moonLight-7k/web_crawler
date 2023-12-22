const { crawlPage } = require("./crawl.js");

async function main() {
  if (process.argv.length !== 3) {
    console.error("× Usage: node main.js <website>");
    process.exit(1);
  }

  const baseUrl = process.argv[2];

  //  TODO: ========|Experimental Feature|=======
  // const targetTag = process.argv[3];
  // if (targetTag == "Text" || targetTag == "text") {
  //   console.log("✓ ======Getting Text======");
  // }

  console.log(`✓ Starting crawler for ${baseUrl}....\n`);

  try {
    const pages = await crawlPage(baseUrl, baseUrl, {},'./data.txt');
    for (const [page, count] of Object.entries(pages)) {
      console.log(`${page}: ${count} visits`);
    }
  } catch (error) {
    console.error(`𐄂 Error in main function: ${error.message}`);
  }
}

main();
