export function imageExtractor($) {
  const assets = [];

  $("img").each((i, el) => {
    const addAsset = (url, sourceAttr) => {
      if (url) {
        assets.push({ url, type: "image", source: `img[${sourceAttr}]` });
      }
    };

    addAsset($(el).attr("src"), "src");
    addAsset($(el).attr("data-src"), "data-src");
    addAsset($(el).attr("data-lazy-src"), "data-lazy-src");
    addAsset($(el).attr("data-original"), "data-original");

    const extractSrcset = (srcset, attrName) => {
      if (srcset) {
        const parts = srcset.split(",");
        for (const part of parts) {
          const trimmed = part.trim();
          if (!trimmed) continue;
          
          const tokens = trimmed.split(/\s+/);
          const url = tokens[0];
          const descriptor = tokens.length > 1 ? tokens[1] : null;
          
          if (url) {
            const asset = { url, type: "image", source: `img[${attrName}]` };
            if (descriptor) {
              if (descriptor.endsWith("w")) {
                asset.widthDescriptor = descriptor;
              } else if (descriptor.endsWith("x")) {
                asset.densityDescriptor = descriptor;
              } else {
                asset.descriptor = descriptor;
              }
            }
            assets.push(asset);
          }
        }
      }
    };

    extractSrcset($(el).attr("srcset"), "srcset");
    extractSrcset($(el).attr("data-srcset"), "data-srcset");
  });

  const metaSelectors = [
    "meta[property='og:image']",
    "meta[name='twitter:image']",
    "meta[itemprop='image']"
  ];

  $(metaSelectors.join(", ")).each((i, el) => {
    const content = $(el).attr("content");
    const attrName = $(el).attr("property") || $(el).attr("name") || $(el).attr("itemprop");
    if (content) {
      assets.push({ url: content, type: "image", source: `meta[${attrName}]` });
    }
  });

  return assets;
}
