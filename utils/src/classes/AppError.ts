export interface DeveloperError {
  message: string;
  statusCode?: number;
  details?: string | string[];
}
export interface CustomError {
  message: string;
  statusCode: number;
  developerError?: DeveloperError;
}

export class AppError extends Error implements CustomError {
  constructor(
    public readonly message: string,
    public readonly statusCode: number,
    public readonly developerError?: DeveloperError
  ) {
    super(message);
  }

  static getStatus(statusCode: number): string {
    return statusCode >= 400 && statusCode < 500 ? "fail" : "error";
  }
}

interface CreateError {
  (statusCode: number): (message: string, developerError?: DeveloperError) => AppError;
}

type CreateErrorReturnType = ReturnType<CreateError>;

export const createError: CreateError = (statusCode) => (message, developerError) =>
  new AppError(message, statusCode, developerError);

export const DEFAULT_ERROR_MESSAGE = "Uhhh!!! Something went wrong.";

export const createBadRequestError: CreateErrorReturnType = createError(400);
export const createUnauthorizedError: CreateErrorReturnType = createError(401);
export const createForbiddenError: CreateErrorReturnType = createError(403);
export const createNotFoundError: CreateErrorReturnType = createError(404);
export const createTooManyReqError: CreateErrorReturnType = createError(429);
export const createInternalServerError: CreateErrorReturnType = createError(400);
