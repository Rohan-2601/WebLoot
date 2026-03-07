import * as cheerio from "cheerio";

export function extractImages(html, baseUrl) {
  const $ = cheerio.load(html);

  let images = [];

  $("img").each((i, el) => {
    let src = $(el).attr("src");

    if (src) {
      images.push(new URL(src, baseUrl).href);
    }
  });

  return images;
}
