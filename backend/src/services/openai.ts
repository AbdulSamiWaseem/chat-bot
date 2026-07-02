import OpenAI from "openai";
import "dotenv/config";
import { ResponseObject, SYSTEM_PROMPT } from "../utils/constants";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const chatService = async (body: any, RESP: ResponseObject) => {
  try {
    const { messages } = body;

    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.4-mini",
      reasoning: { effort: "low" },
      instructions: SYSTEM_PROMPT,
      input: messages,
      max_output_tokens: 500,
    });

    return {
      ...RESP,
      data: {
        role: "assistant",
        content: response.output_text || "",
      },
    };
  } catch (error) {
    console.error("Error", error);
    return {
      ...RESP,
      error: true,
      error_message: "Message Failed Retry!",
    };
  }
};
