export function videoExtractor($) {
  const assets = [];

  $("video").each((i, el) => {
    const src = $(el).attr("src");
    if (src) {
      assets.push({ url: src, type: "video", source: "video[src]" });
    }
  });

  $("video source, source").each((i, el) => {
    const src = $(el).attr("src");
    if (src) {
      const parentTag = $(el).parent().get(0)?.tagName?.toLowerCase();
      const sourceName = parentTag === "video" ? "video source[src]" : "source[src]";
      assets.push({ url: src, type: "video", source: sourceName });
    }
  });

  return assets;
}
