import * as cheerio from "cheerio";
import { imageExtractor } from "./extractors/imageExtractor.js";
import { iconExtractor } from "./extractors/iconExtractor.js";
import { videoExtractor } from "./extractors/videoExtractor.js";
import { cssExtractor } from "./extractors/cssExtractor.js";

const extractors = [imageExtractor, iconExtractor, videoExtractor, cssExtractor];

function normalizeUrl(rawUrl, baseUrl) {
  try {
    const trimmed = (rawUrl || "").trim();
    if (!trimmed) return null;
    if (trimmed.startsWith("javascript:") || trimmed.startsWith("data:") || trimmed.startsWith("mailto:")) return null;

    const parsed = new URL(trimmed, baseUrl);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      if (trimmed.startsWith("#")) return null;
      
      // Strip common cache-busting query parameters to prevent duplicates
      const paramsToStrip = ["v", "version", "ts", "timestamp", "_t", "cache", "cb", "rev"];
      for (const param of paramsToStrip) {
        parsed.searchParams.delete(param);
      }
      
      // Remove trailing slashes from the pathname (unless it's just "/")
      if (parsed.pathname.length > 1 && parsed.pathname.endsWith("/")) {
        parsed.pathname = parsed.pathname.slice(0, -1);
      }
      
      return parsed.href;
    }
    return null;
  } catch {
    return null;
  }
}

export function runExtractionEngine(html, baseUrl, extraAssets = []) {
  const $ = cheerio.load(html);

  let allAssets = [...extraAssets];

  // 1. Run all extractors
  for (const extractor of extractors) {
    const extracted = extractor($);
    allAssets = allAssets.concat(extracted);
  }

  // 2. Normalize and Deduplicate
  const seenUrls = new Set();
  const uniqueAssets = [];
  const duplicates = [];

  for (const asset of allAssets) {
    const normalizedUrl = normalizeUrl(asset.url, baseUrl);

    if (normalizedUrl) {
      if (seenUrls.has(normalizedUrl)) {
        duplicates.push(normalizedUrl);
      } else {
        seenUrls.add(normalizedUrl);
        uniqueAssets.push({
          ...asset,
          url: normalizedUrl,
        });
      }
    }
  }

  // 3. Format back to legacy response for backward compatibility
  const images = uniqueAssets.filter((a) => a.type === "image").map((a) => a.url);
  const icons = uniqueAssets.filter((a) => a.type === "icon").map((a) => a.url);
  const videos = uniqueAssets.filter((a) => a.type === "video").map((a) => a.url);
  const stylesheets = uniqueAssets.filter((a) => a.type === "stylesheet").map((a) => a.url);

  return {
    images,
    icons,
    videos,
    stylesheets,
    duplicates,
    totalAssets: uniqueAssets.length,
    assets: uniqueAssets, // the new unified array for future use
  };
}
