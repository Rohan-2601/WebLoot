import { fetchSiteWithBrowser } from "./server/services/browserService.js";
import { fetchSite } from "./server/services/fetchSite.js";
import { runExtractionEngine } from "./server/engine/index.js";

async function runTest() {
  const url = "https://vercel.com";
  console.log(`Testing against ${url}`);

  try {
    console.log("\\n--- QUICK SCAN ---");
    const quickHtml = await fetchSite(url);
    const quickResult = runExtractionEngine(quickHtml, url);
    console.log(`Quick Scan found ${quickResult.images.length} images`);

    console.log("\\n--- DEEP SCAN ---");
    const { html: deepHtml, networkAssets } = await fetchSiteWithBrowser(url);
    const deepResult = runExtractionEngine(deepHtml, url, networkAssets);
    console.log(`Deep Scan found ${deepResult.images.length} images`);
    
    console.log("\\nTest Completed!");
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}

runTest();
