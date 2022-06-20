#!/usr/bin/env node

const { program } = require("commander");
const fs = require("fs");

/* Auxiliary storage -- saving search results to disk */
const storeData = (filename, data) => {
  try {
    fs.writeFileSync(
      `${filename}.txt`,
      JSON.stringify(data)
        .replace("[", "")
        .replace("]", "")
        .replace(/"/g, "")
        .replace(/(")+(,)(")/g, "\n"),
      {
        encoding: "utf8",
      }
    );
  } catch (err) {
    console.error(err);
  }
};

/* Capture all the CLI inputs */
program.parse(process.argv);

console.info("RUNNING CLI ON", process.cwd());

/* Let's use all the captured values */
const searchTerm = program.args.join(" ");
console.log({ searchTerm });

/* Let's get some search done */
/*Get an instance of our main actor*/
const puppeteer = require("puppeteer");

const connectPuppeteer = async () => {
  const browser = await puppeteer.launch({
    // headless: false,
    // slowMo: 300,
  });
  console.log("Puppeteer launched");
  // Return both page and browser instances that are going to be used elsewhere
  const page = await browser.newPage();
  return { page, browser };
};

/* CAPTURE ALL LINKS, SAVE IN TEXT FILE AND CAPTURE SCREENSHOT */
const saveScreenshot = async (page, url) => {
  // WAIT UNTIL NETWORK IS IDLE TO MAKE SURE ALL IS LOADED
  await page.goto(url, { waitUntil: "networkidle2" });
  console.log("Navigating to", url);
  /* EVALUATE IS WHERE WE CAN START TO MANIPULATE THE DOM */
  const images = await page.evaluate(() => {
    // TEMP STORAGE TO KEEP TRACK OF UNIQUE DOMAINS
    const uniqueUrl = new Set();
    return (
      Array.from(document.querySelectorAll("#links article div a"))
        .filter((link, i) => {
          // GRAB LINK ADDRESS
          const href = link.getAttribute("href");
          // VALIDATION #1 MAKE SURE IT IS A FULL FORM LINK
          const isValidAddress = href.startsWith("https://");
          // VALIDATION #2 MAKE SURE IT IS THE PORTION BEFORE THE .TLD/ (EXAMPLE: HTTPS://CODEIN.CA/but-not/foo/bar
          const domain = href.split(/\w(\/)\w*/)[0];
          // VALIDATION #3  STOP CAPTURING IF STORAGE IS ALREADY FULL (5 ITEMS)
          if (!uniqueUrl.has(domain) && isValidAddress && uniqueUrl.size < 5) {
            // IF VALID AND NOT FULL, THEN ADD TO THE TEMP STORAGE
            uniqueUrl.add(domain);
            // RETURN TO THE FILTER FUNCTION
            return true;
          }
          // RETURN TO THE FILTER FUNCTION
          return false;
        })
        //  TRANSFORM ALL THE LINKS[] INTO SIMPLE HREF[] STRINGS
        .map((link) => link.getAttribute("href"))
    );
  });
  console.log({ images });
  // CREATE A REUSABLE FILENAME PATTERN (WITHOUT SPACES)
  const filename = searchTerm.trim().replace(" ", "_");
  storeData(filename, images);
  /*The screenshot portion below works*/
  await page.screenshot({
    fullPage: true,
    type: "webp",
    omitBackground: true,
    path: `${filename}.webp`,
  });
  console.log("Screenshot saved");
};

const disconnectPuppeteer = async (browser) => await browser.close();
const url = `https://duckduckgo.com/?q=${encodeURIComponent(searchTerm)}`;

const main = async () => {
  const { page, browser } = await connectPuppeteer();
  await saveScreenshot(page, url).then(async (_) => {
    await disconnectPuppeteer(browser).then((_) => console.log("Disconnected"));
  });
};

main().then((_) => console.log("Bye"));
