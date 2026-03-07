import { fetchSite } from "../services/fetchSite.js";
import { extractImages } from "../services/extractImages.js";
import { extractIcons } from "../services/extractIcons.js";
import { extractVideos } from "../services/extractVideos.js";
import { detectDuplicates } from "../analyzers/detectDuplicates.js";

export async function analyze(req, res) {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(url);
  } catch {
    return res.status(400).json({ error: "Invalid URL" });
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    return res
      .status(400)
      .json({ error: "Only HTTP and HTTPS URLs are allowed" });
  }

  try {
    const html = await fetchSite(url);

    const images = extractImages(html, url);
    const icons = extractIcons(html, url);
    const videos = extractVideos(html, url);

    const duplicates = detectDuplicates(images);

    res.json({
      images,
      icons,
      videos,
      duplicates,
      totalAssets: images.length + icons.length + videos.length,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to analyze the site", details: err.message });
  }
}
