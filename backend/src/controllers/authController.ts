// Third party imports
import { Request, Response, NextFunction } from "express";

// User imports
import { catchAsync, createBadRequestError, getTime, SignupI, signupSchema } from "@mono/utils";
import User, { UserD } from "../models/user";

export const signup = catchAsync(async (req: Request<{}, {}, SignupI>, res: Response, next: NextFunction) => {
  // Parsing the payload against the predefined schema
  const { name, email, password, confirmPassword } = await signupSchema.parseAsync(req.body);

  // Checking if there already exist user with that email or not
  const user: UserD | null = await User.findOne({ email });

  // If user is verified or the user has created within 24 hrs
  if (user) {
    if (user.isVerified) return next(createBadRequestError("User already exist with this email address."));
    else if (getTime(user.createdAt, "1") > Date.now())
      return next(
        createBadRequestError(
          "You are already registered with this email address. Please verify your email using the link sent to your inbox and proceed to log in."
        )
      );
  }

  
});
