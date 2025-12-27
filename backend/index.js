import express from "express";
import cors from "cors";
import multer from "multer";
import { PDFParse } from "pdf-parse";
import { buildPrompt } from "./prompt.js";

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

app.post("/generate", async (req, res) => {
  try {
    const { notes } = req.body;
    if (!notes || notes.trim() === "") {
      return res
        .status(400)
        .json({ success: false, error: "Notes are required" });
    }

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        prompt: buildPrompt(notes),
        stream: false,
      }),
    });

    const data = await response.json();

    let mcqs = [];
    if (data?.response) {
      console.log("data?.response>>>", data?.response);
      try {
        const text = data.response.trim();
        const arrayMatch = text.match(/\[.*\]/s);
        if (!arrayMatch) throw new Error("No JSON array found in AI response");
        mcqs = JSON.parse(arrayMatch[0]);
      } catch (err) {
        console.error("Failed to parse AI response:", data.response);
        return res
          .status(500)
          .json({ success: false, error: "Invalid AI JSON" });
      }
    }

    res.json({ success: true, mcqs });
  } catch (err) {
    console.error("Backend error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/generate-pdf", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, error: "PDF file is required" });
    }
    const dataBuffer = req.file.buffer;
    const parser = new PDFParse({ data: dataBuffer });
    await parser.destroy();

    // const pdfData = await PDFParse(dataBuffer);
    const text = await parser.getText();

    const fullText = text.pages
      .map((p) => p.text)
      .join("\n")
      .replace(/-- \d+ of \d+ --/g, "")
      .trim();
    console.log("PDF full  text>>>>", fullText);
    if (!fullText) {
      return res
        .status(400)
        .json({ success: false, error: "PDF contains no extractable text" });
    }

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        prompt: buildPrompt(fullText),
        stream: false,
      }),
    });

    const data = await response.json();

    let mcqs = [];
    if (data?.response) {
      console.log("AI RES:::", data?.response);
      try {
        const trimmedText = data.response.trim();
        const arrayMatch = trimmedText.match(/\[.*\]/s);
        if (!arrayMatch) throw new Error("No JSON array found in AI response");
        mcqs = JSON.parse(arrayMatch[0]);
      } catch (err) {
        console.error("Failed to parse AI response:", data.response);
        return res
          .status(500)
          .json({ success: false, error: "Invalid AI JSON" });
      }
    }

    res.json({ success: true, mcqs });
  } catch (err) {
    console.error("Backend error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(3000, () =>
  console.log("✅ Backend running on http://localhost:3000")
);
