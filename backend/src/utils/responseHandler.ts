import { Request, Response } from "express";
import { createResponseObject, RENDER_BAD_REQUEST } from "./constants";

export const handleResponse = async (options: any, req: Request, res: Response) => {
  try {
    const { handler, validationFn, handlerParams, successMessage, isStream } = options;

    if (validationFn) {
      try {
        await validationFn(req.body);
      } catch (e: any) {
        console.log(e);
        return res.status(400).json({
          code: 400,
          message: e.details[0].message.replace(/\"/g, ""),
        });
      }
    }

    if (isStream) {
      await handler(...handlerParams, res);
      return;
    }

    const RESP = createResponseObject();
    const resp = await handler(...handlerParams, RESP);

    if (resp.error) {
      return res.status(400).json({
        code: 400,
        message: resp.error_message,
      });
    }

    if (!resp.auth) {
      return res.status(403).json({
        code: 403,
        message: resp.error_message,
      });
    }

    res.status(200).json({
      code: 200,
      message: resp.success_message || successMessage,
      data: resp.data,
    });
  } catch (e) {
    RENDER_BAD_REQUEST(res, e);
  }
};
