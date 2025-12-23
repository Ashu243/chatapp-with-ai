import { GoogleGenAI } from "@google/genai";
import { Message } from "../models/message.models.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY
});

export const generateAIResult = async ({ prompt, projectRoomId }) => {
  try {
    const previousMessages = await Message.find({ projectId: projectRoomId })
      .sort({ createdAt: -1 })
      .limit(10);

    previousMessages.reverse();

    const contents = previousMessages.map(msg => ({
      role: msg.senderType === "ai" ? "model" : "user",
      parts: [{ text: msg.content }]
    }));

    contents.push({
      role: "user",
      parts: [{ text: prompt }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
      systemInstruction: `
You are a helpful, friendly AI assistant inside a team collaboration chat app.
Be clear, concise, and conversational.
`
    });

    return {
      success: true,
      content: response.text
    };

  } catch (error) {
    console.error(error);
    return {
      success: false,
      content: "Something went wrong with AI. Please try again later."
    };
  }
};
