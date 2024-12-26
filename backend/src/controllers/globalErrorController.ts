// Third party imports
import { Request, Response, NextFunction } from "express";

// User imports
import { AppError, DEFAULT_ERROR_MESSAGE, DeveloperError } from "@mono/utils";

export default (err: Error, req: Request, res: Response, next: NextFunction) => {
  let message: string = DEFAULT_ERROR_MESSAGE;
  let statusCode: number = 500;
  let developerError: DeveloperError | undefined = undefined;

  if (err instanceof AppError) {
    ({ message, statusCode, developerError } = err);
  }

  res.status(statusCode).json({
    status: AppError.getStatus(statusCode),
    message,
    ...(developerError && { developerError }),
  });
};
