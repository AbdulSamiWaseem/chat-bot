import OpenAI from "openai";
import "dotenv/config";
import { ResponseObject, SYSTEM_PROMPT } from "../utils/constants";
import { Response } from "express";
import { getChatByIdAndUser, createNewChat, updateChatMessages } from "../dal/chat";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const chatService = async (body: any, res: Response) => {
  try {
    const { messages, userId } = body;
    let { chatId } = body;

    let chat;
    if (userId && chatId) {
      chat = await getChatByIdAndUser(chatId, userId);
      if (!chat) {
        res.write(`${JSON.stringify({ error: "Chat not found" })}\n`);
        res.end();
        return;
      }
    } else if (userId) {
      const title = messages[0]?.content.substring(0, 30) || "New Chat";
      chat = await createNewChat(userId, title, messages);
      chatId = chat.id;
    }

    const response = await openai.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.4-mini",
      reasoning: { effort: "low" },
      instructions: SYSTEM_PROMPT,
      input: messages,
      stream: true,
    });

    let assistantResponse = "";

    for await (const chunk of response) {
      if (chunk.type === "response.output_text.delta") {
        assistantResponse += chunk.delta;
        res.write(`${JSON.stringify({ text: chunk.delta })}\n`);
      }
    }

    if (userId && chatId) {
      const updatedChats = [...messages, { role: "assistant", content: assistantResponse }];
      await updateChatMessages(chatId, updatedChats);
    }

    res.write(`${JSON.stringify({ done: true, chatId })}\n`);
    res.end();
  } catch (error) {
    console.log(error);
    res.write(`${JSON.stringify({ error: "Message Failed Retry!" })}\n`);
    res.end();
  }
};
