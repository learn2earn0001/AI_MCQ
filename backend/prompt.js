export function buildPrompt(notes) {
  return `
You are an expert teacher.

Generate 5 UNIQUE multiple-choice questions from the notes below.

Rules:
- 4 options per question
- Only ONE correct answer
- Easy to medium difficulty
- Short explanation


STRICT RULES:
1. Output ONLY valid JSON.
2. Do NOT add explanation or text.
3. Do NOT use markdown.
4. Do NOT write "Here are the questions".
5. Return ONLY an array.

JSON format:
[
  {
    "question": "",
    "options": ["", "", "", ""],
    "correctIndex": 0,
    "difficulty": "",
    "explanation": ""
  }
]

Notes:
${notes}
`;
}
