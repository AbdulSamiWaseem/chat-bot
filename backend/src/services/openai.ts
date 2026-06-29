import OpenAI from "openai";
import "dotenv/config";
import { ResponseObject } from "../utils/constants";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const chatService = async (body: any, RESP: ResponseObject) => {
  try {
    const { messages } = body;

    const response = await openai.responses.create({
      model: "gpt-5.4-mini",
      reasoning: { effort: "low" },
      instructions: "Talk like a ai assistant chatbot",
      input: messages,
      max_output_tokens: 500,
    });
    console.log("response>>>>>>", response);

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
