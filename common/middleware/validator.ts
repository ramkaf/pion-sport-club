import { NextFunction, Request, Response } from "express";
import { Schema } from "joi";
import { ResponseHandler } from "../utils/ResponseHandler";
import { formatJoiMessage } from "../utils/functions";
import { BadRequestError } from "../../common/errors/AppError";

export const validator = (
  schema: Schema,
  reqObj: "body" | "query" | "params",
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[reqObj] as Request, {
      abortEarly: false,
    });
    if (error) {
      let errorMessages = formatJoiMessage(error.details);
      return ResponseHandler.error(res, errorMessages,new BadRequestError(), 400);
    }
    req.body = value;
    next();
  };
};
