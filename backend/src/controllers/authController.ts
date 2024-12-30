// Third party imports
import { Request, Response, NextFunction } from "express";

// User imports
import {
  AppError,
  catchAsync,
  createBadRequestError,
  createTooManyReqError,
  generateToken,
  getTime,
  retryAsync,
  SignupI,
  signupSchema,
} from "@mono/utils";
import User, { UserD } from "../models/user";
import { crypto, sendMail } from "../utils";

const invalidVerifyLinkErr: AppError = createBadRequestError("Invalid email verification link.", {
  message: "The request is invalid.",
  details: [
    "The link may be corrupted.",
    "Include the token query from the URL as a request parameter to /api/v1/auth/verify/:token.",
  ],
});

/////////////////////////////
// ? Helpers
/////////////////////////////
const sendVerifyMail = async (user: UserD) => {
  const { token, encryptedToken } = generateToken(crypto);
  const chancesLeft = user.verify ? user.verify.chancesLeft - 1 : 2;

  user.verify = {
    token,
    chancesLeft,
    expiresAt: new Date(getTime(Date.now(), "0 3")), // expires in 3 hrs
  };

  await user.save();
  sendMail({
    email: user.email,
    payload: {
      name: user.name,
      link: `${process.env.FRONTEND_URL}/auth/verify/?token=${encryptedToken}`,
    },
  });
};

const getUpdatedChances = (
  chancesLeft: number,
  maxChances: number,
  lastExpiry: Date,
  resetAfter: string,
  errMsg: string
): number | AppError => {
  let updatedChances: number = chancesLeft - 1;

  if (chancesLeft < 0) {
    if (getTime(lastExpiry, resetAfter) < Date.now()) {
      updatedChances = maxChances - 1;
    } else {
      return createTooManyReqError(errMsg);
    }
  }

  return updatedChances;
};

//* Signup
export const signup = catchAsync(async (req: Request<{}, {}, SignupI>, res: Response, next: NextFunction) => {
  // Parsing the payload against the predefined schema
  const { name, email, password } = await signupSchema.parseAsync(req.body);

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

  res.status(201).json({
    status: "success",
    message: "User created successfully",
  });

  // Deleting the old user if exists
  user && (await retryAsync(() => user.deleteOne()));

  // Creating the new user
  const newUser: UserD = await retryAsync(() => User.create({ name, email, password }));

  // Sending verification mail
  sendVerifyMail(newUser);
});

// ? Verify Token - get user based on token pased as parameter
export const verifyToken = catchAsync(
  async (req: Request<{ token?: string }, {}, { user?: UserD }>, res: Response, next: NextFunction) => {
    // Parsing the token from request params
    const token: string | undefined = req.params?.token?.trim();

    // Token is not provided or invalid length
    if (!token && token?.length !== 96) return next(invalidVerifyLinkErr);

    // Decrypting the token to get the original token
    const decryptedToken: string | undefined = crypto.decrypter(token, "hex", "utf-8");
    if (!decryptedToken) return next(invalidVerifyLinkErr);

    // Getting user based on token
    const user: UserD | null = await User.findOne({ "verify.token": decryptedToken });
    if (!user) return next(invalidVerifyLinkErr);

    // Checking is the user is already verified or not
    if (user.isVerified) {
      return res.status(200).json({
        status: "sucess",
        message: "The user is already verified. Please proceed to log in.",
      });
    }

    req.body.user = user;
    next();
  }
);

//* Verify Email
export const verify = catchAsync(async (req: Request<{}, {}, { user: UserD }>, res: Response, next: NextFunction) => {
  const user: UserD = req.body.user;

  // Checking if the token is expired or not
  if (user.verify.expiresAt < new Date()) {
    user.isVerified = true;
    res.status(200).json({
      status: "success",
      message: "Email verified successfully. Proceed to log in.",
    });
    await retryAsync(() => user.save());
    return;
  }

  // If there exist no chances to resend the mail and checking if it can be reset or not
  const updatedChances = getUpdatedChances(
    user.verify.chancesLeft,
    5,
    user.verify.expiresAt,
    "0 6",
    "You’ve exceeded the maximum verification attempts. Please try again in 6 hours."
  );

  if (updatedChances instanceof AppError) {
    return next(updatedChances);
  }

  res.status(200).json({
    status: "success",
    message: "The verification link expired. A new one has been sent. Please retry.",
  });

  user.verify.chancesLeft = updatedChances;
  sendVerifyMail(user);
});

export const verifyResendToken = catchAsync(
  async (req: Request<{}, {}, { user: UserD }>, res: Response, next: NextFunction) => {
    const user: UserD = req.body.user;

    const updatedChances = getUpdatedChances(
      user.verify.chancesLeft,
      5,
      user.verify.expiresAt,
      "0 6",
      "You’ve exceeded the maximum verification attempts. Please try again in 6 hours."
    );

    if (updatedChances instanceof AppError) {
      return next(updatedChances);
    }

    res.status(200).json({
      status: "success",
      message: "A new verification email has been sent.",
    });

    user.verify.chancesLeft = updatedChances;
    sendVerifyMail(user);
  }
);

export const verifyResendEmail = catchAsync(async (req: Request, res: Response, next: NextFunction) => {});
