import assert from "assert";
import { runExtractionEngine } from "./server/engine/index.js";

function testEngine() {
  console.log("Running engine tests...");

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta property="og:image" content="https://example.com/meta.jpg">
      <link rel="icon" href="/favicon.ico">
      <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    </head>
    <body>
      <img src="https://example.com/absolute.jpg" />
      <img src="/relative.jpg" />
      <img src="//example.com/protocol-relative.jpg" />
      
      <!-- srcset tests -->
      <img srcset=" /srcset1.jpg 1x,  /srcset2.jpg 2x " />
      <img srcset="small.jpg 480w, medium.jpg 1080w, large.jpg 2048w" />
      <img srcset="  mixed-space.jpg   3x  , malformed.jpg" />
      
      <!-- lazy loading attributes -->
      <img data-src="/lazy.jpg" data-original="/original.jpg" />
      
      <!-- video tests -->
      <video src="/video1.mp4"></video>
      <video><source src="/video2.mp4"></video>
      <picture><source src="/picture-source.jpg"></picture>
      
      <!-- duplicate tests -->
      <img src="/relative.jpg" />
      <img src="/relative.jpg?query=1" /> <!-- different url -->
      <img src="https://example.com/relative.jpg" /> <!-- same as absolute resolution of /relative.jpg -->
      
      <!-- invalid urls -->
      <img src="javascript:alert(1)" />
      <img src="data:image/png;base64,iVBORw0KGgo=" />
      <a href="mailto:test@example.com">Email</a>
      <img src="    " />
      
      <!-- CSS tests -->
      <link rel="stylesheet" href="/styles/main.css" />
      <style>
        .hero { background-image: url('/images/hero-bg.jpg'); }
        @font-face { src: url("fonts/custom.woff2"); }
      </style>
      <div style="background: url(   /images/inline.png  )"></div>
    </body>
    </html>
  `;

  const baseUrl = "https://example.com/page";
  const result = runExtractionEngine(html, baseUrl);

  // Asset totals verification
  const { assets, duplicates } = result;
  
  // Checking normalized URLs
  const urls = assets.map(a => a.url);

  // 1. absolute URLs
  assert(urls.includes("https://example.com/absolute.jpg"), "Absolute URL not found");
  
  // 2. relative URLs (should be resolved)
  assert(urls.includes("https://example.com/relative.jpg"), "Relative URL not resolved correctly");
  assert(urls.includes("https://example.com/favicon.ico"), "Favicon relative URL not resolved correctly");
  
  // 3. protocol-relative URLs
  assert(urls.includes("https://example.com/protocol-relative.jpg"), "Protocol-relative URL not resolved correctly");
  
  // 4. srcset
  assert(urls.includes("https://example.com/srcset1.jpg"), "srcset1 not found");
  assert(urls.includes("https://example.com/srcset2.jpg"), "srcset2 not found");
  
  // verify srcset metadata descriptors
  const srcset1Asset = assets.find(a => a.url === "https://example.com/srcset1.jpg");
  assert.strictEqual(srcset1Asset.densityDescriptor, "1x", "1x descriptor missing");
  const srcset2Asset = assets.find(a => a.url === "https://example.com/srcset2.jpg");
  assert.strictEqual(srcset2Asset.densityDescriptor, "2x", "2x descriptor missing");
  
  assert(urls.includes("https://example.com/small.jpg"), "small.jpg 480w not found");
  const smallAsset = assets.find(a => a.url === "https://example.com/small.jpg");
  assert.strictEqual(smallAsset.widthDescriptor, "480w", "480w descriptor missing");
  
  assert(urls.includes("https://example.com/medium.jpg"), "medium.jpg 1080w not found");
  const mediumAsset = assets.find(a => a.url === "https://example.com/medium.jpg");
  assert.strictEqual(mediumAsset.widthDescriptor, "1080w", "1080w descriptor missing");
  
  assert(urls.includes("https://example.com/large.jpg"), "large.jpg 2048w not found");
  const largeAsset = assets.find(a => a.url === "https://example.com/large.jpg");
  assert.strictEqual(largeAsset.widthDescriptor, "2048w", "2048w descriptor missing");
  
  assert(urls.includes("https://example.com/mixed-space.jpg"), "mixed-space.jpg not found");
  const mixedAsset = assets.find(a => a.url === "https://example.com/mixed-space.jpg");
  assert.strictEqual(mixedAsset.densityDescriptor, "3x", "3x density descriptor missing");
  
  assert(urls.includes("https://example.com/malformed.jpg"), "malformed.jpg not found");
  const malformedAsset = assets.find(a => a.url === "https://example.com/malformed.jpg");
  assert.strictEqual(malformedAsset.widthDescriptor, undefined, "malformed shouldn't have width");
  assert.strictEqual(malformedAsset.densityDescriptor, undefined, "malformed shouldn't have density");
  
  // 5. lazy-loading attributes
  assert(urls.includes("https://example.com/lazy.jpg"), "data-src not found");
  assert(urls.includes("https://example.com/original.jpg"), "data-original not found");

  // 6. videos & sources
  assert(urls.includes("https://example.com/video1.mp4"), "video[src] not found");
  assert(urls.includes("https://example.com/video2.mp4"), "video source[src] not found");
  assert(urls.includes("https://example.com/picture-source.jpg"), "source[src] not found");

  // 7. Metadata
  assert(urls.includes("https://example.com/meta.jpg"), "og:image not found");
  
  // 8. duplicate URLs
  // /relative.jpg was included three times:
  // - <img src="/relative.jpg" />
  // - <img src="/relative.jpg" />
  // - <img src="https://example.com/relative.jpg" />
  // So there should be 2 duplicates for this URL.
  const relativeDupes = duplicates.filter(d => d === "https://example.com/relative.jpg");
  assert.strictEqual(relativeDupes.length, 2, "Duplicates not detected correctly");

  // /relative.jpg?query=1 is not a duplicate
  assert(urls.includes("https://example.com/relative.jpg?query=1"), "Query string URL not found");

  // 9. invalid URLs (should not be in the output)
  const invalidUrls = assets.filter(a => a.url.startsWith("javascript:") || a.url.startsWith("data:") || a.url.startsWith("mailto:"));
  assert.strictEqual(invalidUrls.length, 0, "Invalid URLs should be filtered out");

  // 10. CSS Tests
  assert(urls.includes("https://example.com/styles/main.css"), "Stylesheet link not found");
  assert(result.stylesheets.includes("https://example.com/styles/main.css"), "Stylesheet missing from result.stylesheets array");
  
  assert(urls.includes("https://example.com/images/hero-bg.jpg"), "CSS block background-image URL not found");
  assert(urls.includes("https://example.com/fonts/custom.woff2"), "CSS block font URL not found (resolved relative to baseUrl)");
  
  assert(urls.includes("https://example.com/images/inline.png"), "Inline style URL not found");

  console.log("All engine tests passed successfully!");
}

testEngine();
