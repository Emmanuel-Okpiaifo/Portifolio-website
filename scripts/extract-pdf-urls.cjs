const path = require("path");
const { PDFParse } = require("pdf-parse");

const pdfPath = path.join(__dirname, "..", "Emmanuel-Okpiaifo-FlowCV-Resume-20260212.pdf");

async function run() {
  try {
    const parser = new PDFParse({ url: pdfPath });
    const result = await parser.getText();
    const text = result.text || "";
    const urlRegex = /https?:\/\/[^\s\]\)\"'\s]+/gi;
    const urls = [...new Set(text.match(urlRegex) || [])];
    const domainLike = /(?:https?:\/\/)?(?:[a-z0-9-]+\.)+[a-z]{2,}(?:\/[^\s]*)?/gi;
    const domains = [...new Set(text.match(domainLike) || [])].filter((d) => !d.includes("linktr.ee") && d.length > 8);
    console.log("URLs:", JSON.stringify(urls, null, 2));
    console.log("Domains:", JSON.stringify(domains.slice(0, 30), null, 2));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
