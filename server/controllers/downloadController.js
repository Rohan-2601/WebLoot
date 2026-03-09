import axios from "axios";

const INVALID_FILE_CHARS = /[<>:"/\\|?*\x00-\x1F]/g;

function sanitizeFilename(filename) {
  return filename.replace(INVALID_FILE_CHARS, "_").replace(/\s+/g, " ").trim();
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

    const response = await axios({
      url: assetUrl,
      method: "GET",
      responseType: "stream",
    });

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

    response.data.pipe(res);
  } catch (error) {
    res.status(500).send("Download failed");
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
