export function iconExtractor($) {
  const assets = [];

  const selectors = [
    "link[rel='icon']",
    "link[rel='shortcut icon']",
    "link[rel='apple-touch-icon']",
    "link[rel='apple-touch-icon-precomposed']",
    "link[rel='mask-icon']",
    "link[rel='fluid-icon']"
  ];

  $(selectors.join(", ")).each((i, el) => {
    const href = $(el).attr("href");
    const rel = $(el).attr("rel");
    if (href) {
      assets.push({ url: href, type: "icon", source: `link[rel='${rel}']` });
    }
  });

  return assets;
}
