import express from "express";
import cors from "cors";
import analyzeRoute from "./routes/analyzeRoute.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use(analyzeRoute);

app.get("/", (req, res) => {
  res.json({ message: "WebLoot API is running" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
