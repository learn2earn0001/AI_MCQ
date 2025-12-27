import { useState } from "react";

export default function App() {
  const [notes, setNotes] = useState("");
  const [mcqs, setMcqs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);

  async function generateMCQs() {
    setLoading(true);
    const res = await fetch("http://localhost:3000/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes })
    });
    const data = await res.json();
    setMcqs(data.mcqs || []);
    setLoading(false);
  }

  async function uploadPDF() {
    if (!pdfFile) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("pdf", pdfFile);
    const res = await fetch("http://localhost:3000/generate-pdf", {
      method: "POST",
      body: formData
    });
    const data = await res.json();
    setMcqs(data.mcqs || []);
    setLoading(false);
  }

  return (
    <div className="container">
      <h2>Free AI MCQ Generator</h2>
      <textarea
        placeholder="Paste notes here..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <button onClick={generateMCQs} disabled={loading}>
        {loading ? "Generating..." : "Generate MCQs"}
      </button>
      <hr />
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setPdfFile(e.target.files[0])}
      />
      <button onClick={uploadPDF} disabled={loading || !pdfFile}>
        {loading ? "Generating from PDF..." : "Generate MCQs from PDF"}
      </button>
      <pre>{JSON.stringify(mcqs, null, 2)}</pre>
    </div>
  );
}
