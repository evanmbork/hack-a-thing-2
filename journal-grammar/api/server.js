import "dotenv/config";
import express from "express";
import cors from "cors";
import { analyzeJournal } from "./openai.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "15mb" }));

app.get("/health", (_req, res) => res.json({ ok: true }));

app.post("/analyze", async (req, res) => {
  try {
    const { languageHint, text, imageBase64, imageMime } = req.body || {};

    let imageDataUrl = null;
    if (imageBase64) {
      const mime = imageMime || "image/jpeg";
      imageDataUrl = `data:${mime};base64,${imageBase64}`;
    }

    if ((!text || text.trim().length === 0) && !imageDataUrl) {
      return res.status(400).json({ error: "Provide text or imageBase64." });
    }

    const result = await analyzeJournal({ languageHint, text, imageDataUrl });
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: e.message || "Unknown error" });
  }
});

const port = process.env.PORT || 8787;
app.listen(port, () => console.log(`API listening on http://localhost:${port}`));
