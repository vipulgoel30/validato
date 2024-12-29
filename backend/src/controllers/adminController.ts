// Third party imports
import { Request, Response, NextFunction } from "express";
import { DeleteResult } from "mongoose";

// User imports
import { catchAsync, createUnauthorizedError, getTime } from "@mono/utils";
import User from "../models/user";

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const token: undefined | string = req.headers.authorization?.slice(7);
  console.log(token);
  if (token !== process.env.ADMIN_KEY) {
    return next(createUnauthorizedError("Please provide the security token"));
  }
  next();
});

// Deletes the users which has not verified within 24 hrs
export const deleteExtraUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result: DeleteResult = await User.deleteMany({
    isVerified: false,
    createdAt: { $lt: getTime(new Date(), "1", false) },
  });
  res.status(200).json({
    status: "success",
    ...result,
  });
});
