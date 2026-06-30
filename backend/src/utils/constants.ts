import { Response } from "express";

export interface ResponseObject<Type = any> {
  error: boolean;
  auth: boolean;
  error_message: string;
  success_message: string;
  data: Type | null;
}

export const createResponseObject = (): ResponseObject => {
  return {
    error: false,
    auth: true,
    error_message: "",
    success_message: "",
    data: null,
  };
};

export const RENDER_BAD_REQUEST = (res: Response, error: any) => {
  console.error("Controller handler error caught:", error);
  return res.status(400).json({
    code: 400,
    message: error.message || error || "Bad Request",
  });
};

export const SYSTEM_PROMPT = `You are a highly capable, helpful, and friendly AI assistant. Your primary goal is to provide accurate, clear, and concise information.`;
