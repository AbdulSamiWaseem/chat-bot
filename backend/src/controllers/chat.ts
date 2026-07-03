import { Request, Response } from "express";
import { chatService, getChatHistory, getChatById } from "../services/openai";
import { validateChat } from "../validation/chat";
import { handleResponse } from "../utils/responseHandler";

export const chat = async (req: Request, res: Response) => {
  res.setHeader('Transfer-Encoding', 'chunked');
  await handleResponse(
    {
      handler: chatService,
      validationFn: validateChat,
      handlerParams: [req.body],
      isStream: true,
    },
    req,
    res
  );
};

export const history = async (req: Request, res: Response) => {
  await handleResponse(
    {
      handler: getChatHistory,
      handlerParams: [req.query],
      isStream: false,
    },
    req,
    res
  );
};

export const chatById = async (req: Request, res: Response) => {
  await handleResponse(
    {
      handler: getChatById,
      handlerParams: [{ chatId: req.params.id }],
      isStream: false,
    },
    req,
    res
  );
};
