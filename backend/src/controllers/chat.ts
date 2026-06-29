import { Request, Response } from "express";
import { chatService } from "../services/openai";
import { validateChat } from "../validation/chat";
import { handleResponse } from "../utils/responseHandler";

export const chat = async (req: Request, res: Response) => {
  await handleResponse(
    {
      handler: chatService,
      validationFn: validateChat,
      handlerParams: [req.body],
      successMessage: "Chat response generated.",
    },
    req,
    res
  );
};
