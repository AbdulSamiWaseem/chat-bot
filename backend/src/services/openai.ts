import OpenAI from "openai";
import "dotenv/config";
import { ResponseObject, SYSTEM_PROMPT } from "../utils/constants";
import { Response } from "express";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const chatService = async (body: any, res: Response) => {
  try {
    const { messages } = body;

    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.4-mini",
      reasoning: { effort: "low" },
      instructions: SYSTEM_PROMPT,
      input: messages,
      stream: true,
    });

    for await (const chunk of response) {
      console.log("chunk>>>> ", chunk);

      if (chunk.type === "response.output_text.delta") {
        console.log("chunk.delta>>>> ", chunk.delta);
        res.write(`${JSON.stringify({ text: chunk.delta })}\n`);
      }
    }
    res.write(`${JSON.stringify({ done: true })}\n`);
    res.end();
  } catch (error) {
    console.log(error);
    res.write(`${JSON.stringify({ error: "Message Failed Retry!" })}\n`);
    res.end();
  }
};
