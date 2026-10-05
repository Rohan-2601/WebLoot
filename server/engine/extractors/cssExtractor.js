export function cssExtractor($) {
  const assets = [];

  // 1. CSS files referenced through <link rel="stylesheet">
  $("link[rel='stylesheet']").each((i, el) => {
    const href = $(el).attr("href");
    if (href) {
      assets.push({ url: href, type: "stylesheet", source: "link[rel='stylesheet']" });
    }
  });

  // Helper to find url(...) in CSS text
  const extractUrlsFromCss = (cssText, sourceDesc) => {
    if (!cssText) return;
    
    // Regex to match url(...)
    // Supports quotes, single quotes, or no quotes
    const regex = /url\(\s*(['"]?)(.*?)\1\s*\)/gi;
    let match;
    while ((match = regex.exec(cssText)) !== null) {
      const url = match[2];
      if (url && !url.startsWith("data:")) { // skip inline data urls
        assets.push({ url, type: "css-url", source: sourceDesc });
      }
    }
  };

  // 2. <style> blocks
  $("style").each((i, el) => {
    const cssText = $(el).html();
    if (cssText) {
      extractUrlsFromCss(cssText, "style block");
    }
  });

  // 3. Inline style attributes
  $("[style]").each((i, el) => {
    const styleText = $(el).attr("style");
    if (styleText) {
      const tagName = el.tagName ? el.tagName.toLowerCase() : "element";
      extractUrlsFromCss(styleText, `${tagName}[style]`);
    }
  });

  return assets;
}
