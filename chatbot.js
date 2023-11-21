import express from "express";
import pkg from "body-parser";
const { json } = pkg;
import OpenAi from "openai";
import { OPENAI_API_KEY } from "./constant.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(json());

const openai = new OpenAi({ apiKey: OPENAI_API_KEY });

// Handle incoming messages
app.post("/chat", async (req, res) => {
  try {
    const message = req.body.message;
    const openaiResponse = await getOpenAIResponse(message);
    const reply = openaiResponse.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

async function getOpenAIResponse(message) {
  const prompt = `${message}, (Only give information about Bangalore based restaurant)`;
  const response = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-3.5-turbo",
  });
  return response;
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
