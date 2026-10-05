import express from "express";
import axios from "axios";
import { downloadFile } from "./server/controllers/downloadController.js";
import { safeFetch } from "./server/utils/fetcher.js";

async function testDownload() {
  const app = express();
  
  // Set up test server
  app.get("/small-image", (req, res) => {
    res.setHeader("Content-Type", "image/png");
    res.send(Buffer.alloc(100, 1));
  });

  app.get("/large-image", (req, res) => {
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Content-Length", (51 * 1024 * 1024).toString());
    res.send("too large");
  });

  app.get("/public-video", (req, res) => {
    res.setHeader("Content-Type", "video/mp4");
    res.send(Buffer.alloc(1024, 2));
  });

  app.get("/api/download", downloadFile);

  const server = app.listen(0, async () => {
    const port = server.address().port;
    console.log(`Test server running on port ${port}`);

    try {
      console.log("Testing small image...");
      const res1 = await axios.get(`http://localhost:${port}/api/download?url=http://localhost:${port}/small-image`, { responseType: "arraybuffer" });
      console.log("Small image size:", res1.data.length);
      console.log("Headers:", res1.headers['content-type'], res1.headers['content-disposition']);

      console.log("\\nTesting large image...");
      try {
        await axios.get(`http://localhost:${port}/api/download?url=http://localhost:${port}/large-image`);
      } catch (e) {
        console.log("Large image error:", e.response?.status, e.response?.data.toString());
      }

      console.log("\\nTesting public video...");
      const res3 = await axios.get(`http://localhost:${port}/api/download?url=http://localhost:${port}/public-video`, { responseType: "arraybuffer" });
      console.log("Public video size:", res3.data.length);

      console.log("\\nTesting invalid URL...");
      try {
        await axios.get(`http://localhost:${port}/api/download?url=javascript:alert(1)`);
      } catch (e) {
        console.log("Invalid URL error:", e.response?.status, e.response?.data.toString());
      }

      console.log("\\nTesting unreachable URL...");
      try {
        await axios.get(`http://localhost:${port}/api/download?url=http://127.0.0.1:99999/test`);
      } catch (e) {
        console.log("Unreachable URL error:", e.response?.status, e.response?.data.toString());
      }

      console.log("\\nTesting upstream 404...");
      try {
        await axios.get(`http://localhost:${port}/api/download?url=http://localhost:${port}/not-found`);
      } catch (e) {
        console.log("Upstream 404 error:", e.response?.status, e.response?.data.toString());
      }
      
    } catch (e) {
      console.error(e);
    } finally {
      server.close();
      process.exit(0);
    }
  });
}

testDownload();
