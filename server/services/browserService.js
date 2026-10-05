import { chromium } from "playwright";
import { validateUrlSafety } from "../utils/security.js";

const MAX_CONCURRENT_SCANS = 3;
let currentScans = 0;

export async function fetchSiteWithBrowser(urlStr) {
  if (currentScans >= MAX_CONCURRENT_SCANS) {
    throw new Error("Server is currently busy processing too many deep scans. Please try again later.");
  }

  // 1. Validate the URL
  const parsedUrl = await validateUrlSafety(urlStr);

  currentScans++;
  let browser;
  let context;
  
  // Timeout for the entire scan to prevent hanging
  const scanTimeout = setTimeout(() => {
    if (browser) {
      browser.close().catch(() => {});
    }
  }, 45000); // 45 seconds total execution limit

  try {
    // 2. Launch a controlled browser context
    browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--single-process'
      ]
    });

    context = await browser.newContext();
    const page = await context.newPage();

    const networkAssets = [];
    const validResourceTypes = ["image", "media", "font", "stylesheet"];
    const ignoredUrls = [
      /google-analytics/,
      /doubleclick/,
      /facebook\.com\/tr/,
      /ads?/,
      /tracking/i
    ];

    page.on("response", async (response) => {
      const req = response.request();
      const resourceType = req.resourceType();
      const url = req.url();

      if (validResourceTypes.includes(resourceType)) {
        if (!ignoredUrls.some(regex => regex.test(url))) {
          let contentType = "";
          try {
            const headers = await response.headers();
            contentType = headers["content-type"] || "";
          } catch {
            // ignore header fetch errors
          }
          
          let assetType = "other";
          if (resourceType === "image") assetType = "image";
          if (resourceType === "media") assetType = "video";
          if (resourceType === "stylesheet") assetType = "stylesheet";
          if (resourceType === "font") assetType = "font";

          // Prevent excessive asset collection
          if (networkAssets.length < 500) {
            networkAssets.push({
              url,
              type: assetType,
              source: "network",
              resourceType,
              contentType,
            });
          }
        }
      }
    });

    // Let the network continue so we can observe responses
    await page.route('**/*', (route) => {
      route.continue();
    });

    // 3 & 4. Navigate to the URL with reasonable timeout
    await page.goto(parsedUrl.href, {
      timeout: 20000,
      waitUntil: "domcontentloaded" // Wait for HTML and basic scripts
    });

    // 5. Wait for the page to reach a useful state (network idle)
    try {
      await page.waitForLoadState("networkidle", { timeout: 10000 });
      // Scroll to trigger lazy loading
      await page.evaluate(async () => {
        await new Promise((resolve) => {
          let totalHeight = 0;
          const distance = 500;
          const timer = setInterval(() => {
            const scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;
            if (totalHeight >= scrollHeight || totalHeight > 5000) {
              clearInterval(timer);
              resolve();
            }
          }, 100);
        });
      });
      // wait a bit after scrolling
      await page.waitForTimeout(1000);
    } catch (e) {
      // Ignore networkidle/scroll timeout
    }

    // 6. Inspect the rendered DOM
    const html = await page.content();
    
    // Check max response size (e.g. 10MB)
    if (html.length > 10 * 1024 * 1024) {
      throw new Error("Rendered HTML exceeded maximum size limit");
    }
    
    return { html, networkAssets };
  } catch (err) {
    throw new Error(`Browser extraction failed: ${err.message}`);
  } finally {
    clearTimeout(scanTimeout);
    if (context) await context.close().catch(() => {});
    if (browser) await browser.close().catch(() => {});
    currentScans--;
  }
}
