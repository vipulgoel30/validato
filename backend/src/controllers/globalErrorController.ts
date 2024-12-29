// Third party imports
import { Request, Response, NextFunction } from "express";

// User imports
import { AppError, DEFAULT_ERROR_MESSAGE, DeveloperError } from "@mono/utils";
import { ZodError } from "zod";

type ErrMessage = string | string[];

interface ErrHandlerReturn {
  statusCode: number;
  message: ErrMessage;
}

const handleZodError = (err: ZodError): ErrHandlerReturn => {
  return { statusCode: 400, message: err.errors.map((err) => err.message) };
};

export default (err: Error, req: Request, res: Response, next: NextFunction) => {
  let message: ErrMessage = DEFAULT_ERROR_MESSAGE;
  let statusCode: number = 500;
  let developerError: DeveloperError | undefined = undefined;

  if (err instanceof AppError) {
    ({ message, statusCode, developerError } = err);
  } else if (err instanceof ZodError) {
    // console.log(err.errors);
    ({ message, statusCode } = handleZodError(err));
  }

  res.status(statusCode).json({
    status: AppError.getStatus(statusCode),
    message,
    ...(developerError && { developerError }),
  });
};
