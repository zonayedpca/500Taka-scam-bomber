const puppeteer = require("puppeteer");
const arguments = process.argv;
const url = arguments[2];

function validateUrl(value) {
  return /((http|https)\:\/\/)?[a-zA-Z0-9\.\/\?\:@\-_=#]+\.([a-zA-Z0-9\&\.\/\?\:@\-_=#])*/g.test(
    value
  );
}

if (validateUrl(url)) {
  (async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    for (let i = 0; i < 1000; i++) {
      try {
        await page.goto(url, { waitUntil: "domcontentloaded" });
        await page.waitForSelector(".row1 input");
        await page.$$eval("input", (inputs) =>
          inputs.forEach((input) => {
            input.value = "বাটপার";
          })
        );
        await page.$eval("input[type=submit]", (e) => e.click());
        await page.waitForSelector("input[name=user]");
        await page.$$eval("input", (inputs) =>
          inputs.forEach((input) => {
            input.value = "বিশাল বড় বাটপার";
          })
        );
        await page.$eval("input[type=submit]", (e) => e.click());
        await page.waitForFunction(
          'document.querySelector("input[type=submit]").value.includes("Complete & get money")'
        );
        await page.$eval("input[type=submit]", (e) => e.click());
        console.log("Done", i + 1, "times");
      } catch (err) {
        console.log("this one interrupted");
      } finally {
        await page.goto(url, { waitUntil: "domcontentloaded" });
      }
    }

    await browser.close();
  })();
} else {
  console.log("Check your URL once again");
}
