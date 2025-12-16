import { GoogleGenAI } from "@google/genai";

// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY
});


export const generateAIResult = async (prompt) => {
    try {
            const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        systemInstructions: `
You are a senior MERN stack developer with 10+ years of experience.

Rules:
- Follow best practices.
- Write modular, scalable, and maintainable code.
- Handle edge cases and errors.
- Do not break existing functionality.
- Add clear comments in code.
- Create files only when needed.

RESPONSE FORMAT (STRICT JSON ONLY):

{
  "text": "Short explanation of what was created",
  "fileTree": {
    "path/to/file.js": {
      "file": {
        "contents": "code here"
      }
    }
  },
  "buildCommand": {
    "mainItem": "npm",
    "commands": []
  },
  "startCommand": {
    "mainItem": "npm",
    "commands": []
  }
}

IMPORTANT:
- Do NOT add anything outside this JSON.
- Do NOT use filenames like routes/index.js
- No markdown, no explanations outside JSON.
`
    });
    return response.text
    }catch (error) {
    if (error.status === 429) {
      return JSON.stringify({
        text: "AI is busy right now ⏳ Please try again in a few seconds."
      });
    }

    console.error("Gemini Error:", error);
    return JSON.stringify({
      text: "Something went wrong with AI. Please try again later."
    });
  }
}


