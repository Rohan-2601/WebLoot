import { fetchSite } from "../services/fetchSite.js";
import { fetchSiteWithBrowser } from "../services/browserService.js";
import { runExtractionEngine } from "../engine/index.js";

export async function analyze(req, res) {
  const { url, deepScan } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    let html;
    let networkAssets = [];
    if (deepScan) {
      const result = await fetchSiteWithBrowser(url);
      html = result.html;
      networkAssets = result.networkAssets;
    } else {
      html = await fetchSite(url);
    }

    const extractionResult = runExtractionEngine(html, url, networkAssets);

    res.json(extractionResult);
  } catch (err) {
    let statusCode = 502; // Bad Gateway as default for fetch failures
    let errorMessage = "Failed to analyze the site";

    const msg = err.message || "";
    if (msg.includes("Invalid URL") || msg.includes("Only HTTP")) {
      statusCode = 400;
      errorMessage = msg;
    } else if (msg.includes("not allowed") || msg.includes("private") || msg.includes("forbidden") || msg.includes("Localhost")) {
      statusCode = 403;
      errorMessage = "Access to internal networks is forbidden";
    } else if (err.response) {
      statusCode = err.response.status >= 400 && err.response.status < 500 ? 400 : 502;
      errorMessage = `External site returned status ${err.response.status}`;
    } else if (err.code === "ECONNABORTED" || msg.includes("timeout") || msg.includes("redirects")) {
      statusCode = 504;
      errorMessage = "External site timed out or too many redirects";
    }

    res.status(statusCode).json({ error: errorMessage });
  }
}


