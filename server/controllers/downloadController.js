import { safeFetch } from "../utils/fetcher.js";

const INVALID_FILE_CHARS = /[<>:"/\\|?*\x00-\x1F]/g;
const MAX_DOWNLOAD_SIZE = 50 * 1024 * 1024; // 50MB

function sanitizeFilename(filename) {
  const basename = filename.replace(/^.*[\\/]/, '');
  return basename.replace(INVALID_FILE_CHARS, "_").replace(/\s+/g, " ").trim();
}

function buildFilename(assetUrl, fallbackBaseName) {
  try {
    const parsedUrl = new URL(assetUrl);
    const pathname = parsedUrl.pathname || "";
    const rawName = pathname.split("/").pop() || "";
    const decodedName = decodeURIComponent(rawName);
    const safeName = sanitizeFilename(decodedName);

    if (safeName) {
      return safeName;
    }
  } catch {
    // Ignore parsing errors and use fallback name.
  }

  return `${fallbackBaseName}-${Date.now()}`;
}

const streamDownload = async (req, res, fallbackBaseName = "asset") => {
  try {
    const assetUrl = req.query.url;

    if (!assetUrl) {
      return res.status(400).send("URL parameter is required");
    }

    const response = await safeFetch(assetUrl, {
      method: "GET",
      responseType: "stream",
      timeout: 15000,
    });

    if (response.status >= 400) {
      return res.status(response.status).send(`External asset returned status ${response.status}`);
    }

    const contentLength = response.headers["content-length"];
    if (contentLength && parseInt(contentLength, 10) > MAX_DOWNLOAD_SIZE) {
      return res.status(413).send("File too large");
    }

    const filename = buildFilename(assetUrl, fallbackBaseName);

    if (response.headers["content-type"]) {
      res.setHeader("Content-Type", response.headers["content-type"]);
    }

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(
        filename,
      )}`,
    );

    let downloadedSize = 0;
    response.data.on('data', (chunk) => {
      downloadedSize += chunk.length;
      if (downloadedSize > MAX_DOWNLOAD_SIZE) {
        response.data.destroy();
        if (!res.headersSent) {
          res.status(413).send("File too large");
        } else {
          res.end();
        }
      }
    });

    response.data.on('error', () => {
      if (!res.headersSent) res.status(502).send("Error streaming the file");
      else res.end();
    });

    req.on('close', () => {
      if (response.data) response.data.destroy();
    });

    response.data.pipe(res);
  } catch (err) {
    const msg = err.message || "";
    if (msg.includes("Invalid URL") || msg.includes("Only HTTP")) {
      res.status(400).send(msg);
    } else if (msg.includes("not allowed") || msg.includes("private") || msg.includes("Localhost")) {
      res.status(403).send("Access to internal networks is forbidden");
    } else {
      res.status(502).send("Download failed: " + msg);
    }
  }
};

export const downloadFile = async (req, res) =>
  streamDownload(req, res, "asset");

export const downloadImage = async (req, res) =>
  streamDownload(req, res, "image");

export const downloadIcon = async (req, res) =>
  streamDownload(req, res, "icon");

export const downloadVideo = async (req, res) =>
  streamDownload(req, res, "video");
