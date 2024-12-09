import { Response } from "express";

export class ResponseHandler {
  static success(res: any, data: any, message: string = "Request successful") {
    return res.status(200).json({
      status: "success",
      message,
      data,
    });
  }

  static error(
    res: any,
    message: string | string[],
    error: any = null,
    statusCode: number = 500,
  ) {
    return res.status(statusCode).json({
      status: "error",
      message,
    });
  }
}

export const handleAction = async (
  action: () => Promise<any>,
  successMessage: string,
  errorMessage: string,
  res: Response
) => {
  try {
    const result = await action();
    return ResponseHandler.success(res, result, successMessage);
  } catch (error) {
    console.error(error);
    return ResponseHandler.error(res, errorMessage, error);
  }
}