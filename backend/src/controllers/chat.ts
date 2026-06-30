import { Request, Response } from "express";
import { chatService } from "../services/openai";
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
