import Joi from "joi";

export function validateChat(chat: any) {
  const schema = Joi.object({
    messages: Joi.array().items(
      Joi.object({
        role: Joi.string().valid("user", "assistant").required(),
        content: Joi.string().min(1).required(),
      })
    ).min(1).required(),
  });
  return schema.validateAsync(chat);
}
