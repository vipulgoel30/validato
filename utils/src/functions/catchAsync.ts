// Third party imports
import { Request, Response, NextFunction } from "express";

export const catchAsync = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    return fn(req, res, next).catch(next);
  };
};
