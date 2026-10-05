import axios from "axios";

async function runTests() {
  console.log("Testing Analyze...");
  try {
    const res = await axios.post("http://localhost:5000/analyze", { url: "https://example.com" });
    console.log("Analyze example.com:", res.status);
  } catch(e) { console.error("Analyze example.com failed:", e.message); }

  try {
    const res = await axios.post("http://localhost:5000/analyze", { url: "http://localhost:3000" });
    console.log("Analyze localhost:", res.status);
  } catch(e) { console.log("Analyze localhost:", e.response?.status, e.response?.data); }

  try {
    const res = await axios.post("http://localhost:5000/analyze", { url: "http://169.254.169.254" });
    console.log("Analyze 169.254.169.254:", res.status);
  } catch(e) { console.log("Analyze 169.254.169.254:", e.response?.status, e.response?.data); }

  console.log("\nTesting Download...");
  try {
    const res = await axios.get("http://localhost:5000/download?url=https://via.placeholder.com/150");
    console.log("Download public image:", res.status);
  } catch(e) { console.error("Download public image failed:", e.message); }

  try {
    const res = await axios.get("http://localhost:5000/download?url=http://127.0.0.1:5000");
    console.log("Download localhost:", res.status);
  } catch(e) { console.log("Download localhost:", e.response?.status, e.response?.data); }

  console.log("\nTesting Download large file (should be aborted)...");
  try {
    const res = await axios.get("http://localhost:5000/download?url=https://speed.hetzner.de/100MB.bin");
    console.log("Download large file:", res.status);
  } catch(e) { console.log("Download large file:", e.response?.status, e.response?.data || e.message); }
}

runTests();
