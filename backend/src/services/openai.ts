import OpenAI from "openai";
import "dotenv/config";
import { ResponseObject, SYSTEM_PROMPT } from "../utils/constants";
import { Response } from "express";
import { getChat, createNewChat, updateChatMessages, getChatHistoryByUserId } from "../dal/chat";
import { fetchWeather } from "./weather";
import { fetchLocation } from "./location";
import {
  addAppointment,
  getAppointments,
  updateAppointment,
  cancelAppointment,
} from "./appointment";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const tools = [
  {
    type: "function",
    name: "get_weather",
    description: "Get the weather for a specified location.",
    parameters: {
      type: "object",
      properties: {
        location: { type: "string" },
      },
      required: ["location"],
    },
  },
  {
    type: "function",
    name: "get_location",
    description: "Get address details of a specified place, or address query.",
    parameters: {
      type: "object",
      properties: {
        query: { type: "string" },
      },
      required: ["query"],
    },
  },
  {
    type: "function",
    name: "create_appointment",
    description: "Create a new appointment for the user.",
    parameters: {
      type: "object",
      properties: {
        purpose: { type: "string" },
        startTime: { type: "string", description: "format 2026-07-08T15:00:00" },
        endTime: { type: "string", description: "format 2026-07-08T16:00:00" },
      },
      required: ["purpose", "startTime", "endTime"],
    },
  },
  {
    type: "function",
    name: "get_appointments",
    description: "Get all upcoming appointments for the user.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    type: "function",
    name: "update_appointment",
    description: "Update an existing appointment.",
    parameters: {
      type: "object",
      properties: {
        id: { type: "number" },
        purpose: { type: "string" },
        startTime: { type: "string", description: "format 2026-07-08T15:00:00" },
        endTime: { type: "string", description: "format 2026-07-08T16:00:00" },
      },
      required: ["id"],
    },
  },
  {
    type: "function",
    name: "cancel_appointment",
    description: "Cancel an appointment.",
    parameters: {
      type: "object",
      properties: {
        id: { type: "number" },
      },
      required: ["id"],
    },
  },
];

const callFunction = async (name, args, userId) => {
  if (name === "get_weather") {
    return await fetchWeather(args.location);
  }
  if (name === "get_location") {
    return await fetchLocation(args.query);
  }
  if (name === "create_appointment") {
    return await addAppointment(userId, args.purpose, args.startTime, args.endTime);
  }
  if (name === "get_appointments") {
    return await getAppointments(userId);
  }
  if (name === "update_appointment") {
    return await updateAppointment(args.id, userId, {
      purpose: args.purpose,
      startTime: args.startTime,
      endTime: args.endTime,
    });
  }
  if (name === "cancel_appointment") {
    return await cancelAppointment(args.id, userId);
  }
};

export const chatService = async (body: any, res: Response) => {
  try {
    const { messages, userId } = body;
    let { chatId } = body;

    let chat;
    if (userId && chatId) {
      chat = await getChat(chatId);
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
      instructions: SYSTEM_PROMPT,
      input: messages,
      tools: tools,
      stream: true,
    });

    let assistantResponse = "";
    const toolCalls = [];

    for await (const chunk of response) {
      if (chunk.type === "response.output_text.delta") {
        assistantResponse += chunk.delta;
        res.write(`${JSON.stringify({ text: chunk.delta })}\n`);
      } else if (chunk.type === "response.output_item.done" && chunk.item?.type === "function_call") {
        toolCalls.push(chunk.item);
      }
    }

    if (toolCalls.length > 0) {
      const toolOutputs = [];

      for (const toolCall of toolCalls) {
        const name = toolCall.name;
        const args = JSON.parse(toolCall.arguments);
        const result = await callFunction(name, args, userId);

        toolOutputs.push({
          type: "function_call_output",
          call_id: toolCall.call_id,
          output: result ? JSON.stringify(result) : "Unavailable",
        });
      }

      const input = [
        ...messages,
        ...toolCalls,
        ...toolOutputs,
      ];

      const responseStream = await openai.responses.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        instructions: SYSTEM_PROMPT,
        input,
        stream: true,
      });

      assistantResponse = "";
      for await (const chunk of responseStream) {
        if (chunk.type === "response.output_text.delta") {
          assistantResponse += chunk.delta;
          res.write(`${JSON.stringify({ text: chunk.delta })}\n`);
        }
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

export const getChatHistory = async (params: any, resp: ResponseObject) => {
  try {
    const { userId } = params;

    if (!userId) {
      return {
        error: true,
        error_message: "User ID is required",
      };
    }

    const chats = await getChatHistoryByUserId(userId);

    return {
      ...resp,
      success_message: "Chat history fetched successfully",
      data: chats,
    };
  } catch (error: any) {
    console.error("Error:", error);
    return {
      error: true,
      error_message: error.message || "Failed to get chat history",
    };
  }
};

export const getChatById = async (params: any, resp: ResponseObject) => {
  try {
    const { chatId } = params;

    if (!chatId) {
      return {
        error: true,
        error_message: "Chat ID is required",
      };
    }

    const chat = await getChat(chatId);

    if (!chat) {
      return {
        error: true,
        error_message: "Chat not found",
      };
    }

    return {
      ...resp,
      success_message: "Chat fetched successfully",
      data: chat,
    };
  } catch (error: any) {
    console.error("Error:", error);
    return {
      error: true,
      error_message: error.message || "Failed to get chat",
    };
  }
};
