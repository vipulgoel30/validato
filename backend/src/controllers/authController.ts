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
  signupSchema,
  type SignupI,
  type GenerateTokenReturnType,
  userSchema,
  LoginI,
  loginSchema,
} from "@mono/utils";
import User, { UserD } from "../models/user";
import { crypto, sendMail } from "../utils";
import { VERIFY_MAX_CHANCES, VERIFY_RESET_IN, VERIFY_EXPIRES_IN } from "../models/user";

/////////////////////////////
// ? Helpers
/////////////////////////////
const sendVerifyMail = async (user: UserD) => {
  const { token, encryptedToken }: GenerateTokenReturnType = generateToken(crypto);
  const chancesLeft: number = (user.verify ? user.verify.chancesLeft : VERIFY_MAX_CHANCES) - 1;

  user.verify = {
    token,
    chancesLeft,
    expiresAt: new Date(getTime(Date.now(), VERIFY_EXPIRES_IN)), // expires in 3 hrs
  };

  await retryAsync(() => user.save());

  sendMail({
    email: user.email,
    payload: {
      name: user.name,
      link: `${process.env.FRONTEND_URL}/auth/verify?token=${encryptedToken}`,
    },
  });
};

const getChances = (chancesLeft: number, maxChances: number, lastExpiry: Date, resetAfter: string, errMsg: string): number => {
  if (chancesLeft === 0) {
    if (getTime(lastExpiry, resetAfter) < Date.now()) {
      return maxChances;
    } else {
      throw createTooManyReqError(errMsg);
    }
  }
  return chancesLeft;
};

/////////////////////////////
// ? Middlewares
/////////////////////////////

// ? Validate Token - get user based on token pased as parameter
const InvalidVerifyLinkErr: AppError = createBadRequestError("The email verification link is not valid.", {
  message: "The request is not valid.",
  details: ["The link might be broken.", "Ensure the token query parameter from the URL is passed correctly to /api/v1/auth/verify."],
});

export const validateToken = catchAsync(
  async (req: Request<{}, {}, { user?: UserD }, { token?: string }>, res: Response, next: NextFunction) => {
    // Parsing the token from request params
    const token: string | undefined = req.query?.token?.trim();

    // Token is not provided or invalid length
    if (!token || token.length !== 96) return next(InvalidVerifyLinkErr);

    // Decrypting the token to get the original token
    const decryptedToken: string | undefined = crypto.decrypter(token, "hex", "utf-8");
    if (!decryptedToken) return next(InvalidVerifyLinkErr);

    // Getting user based on token
    const user: UserD | null = await User.findOne({
      "verify.token": decryptedToken,
    });
    if (!user) return next(InvalidVerifyLinkErr);

    // Checking is the user is already verified or not
    if (user.isVerified) {
      return res.status(200).json({
        status: "success",
        message: "The user is already verified. Please proceed to log in.",
      });
    }

    req.body.user = user;
    next();
  }
);

// ? Validate email - get user based on email
export const validateEmail = catchAsync(
  async (req: Request<{}, {}, { user?: UserD }, { email?: string }>, res: Response, next: NextFunction) => {
    const email: string | undefined = req.query?.email?.trim();

    // If the email is provided or not or whether it is formatted correctly or not
    if (!email || !(await userSchema.email.safeParseAsync(email)).success) {
      return next(
        createBadRequestError("Valid email is required.", {
          message: "Invalid request.",
          details: ["Include the email parameter in /api/v1/auth/verify/resend."],
        })
      );
    }

    // Getting user based on email
    const user: UserD | null = await User.findOne({ email });
    if (!user) {
      return next(createBadRequestError("User not found with the provided email."));
    }

    req.body.user = user;
    next();
  }
);

/////////////////////////////
// ? Handlers
/////////////////////////////

//? Signup
export const signup = catchAsync(async (req: Request<{}, {}, SignupI>, res: Response, next: NextFunction) => {
  // Parsing the payload against the predefined schema
  const { name, email, password } = await signupSchema.parseAsync(req.body);

  // Checking if there already exist user with that email or not
  const user: UserD | null = await retryAsync(() => User.findOne({ email }));

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
  try {
    user.verify.chancesLeft = getChances(
      user.verify.chancesLeft,
      VERIFY_MAX_CHANCES,
      user.verify.expiresAt,
      VERIFY_RESET_IN,
      "You’ve exceeded the maximum verification attempts. Please try again in 6 hours."
    );
  } catch (err) {
    return next(err);
  }

  res.status(200).json({
    status: "success",
    message: "The verification link expired. A new one has been sent. Please retry.",
  });

  sendVerifyMail(user);
});

export const verifyResend = catchAsync(async (req: Request<{}, {}, { user: UserD }>, res: Response, next: NextFunction) => {
  const user: UserD = req.body.user;

  try {
    user.verify.chancesLeft = getChances(
      user.verify.chancesLeft,
      VERIFY_MAX_CHANCES,
      user.verify.expiresAt,
      VERIFY_RESET_IN,
      "You’ve exceeded the maximum verification attempts. Please try again in 6 hours."
    );
  } catch (err) {
    return next(err);
  }

  res.status(200).json({
    status: "success",
    message: "A new verification email has been sent.",
  });

  sendVerifyMail(user);
});

export const login = catchAsync(async (req: Request<{}, {}, LoginI>, res: Response, next: NextFunction) => {
  const { email, password } = await loginSchema.parseAsync(req.body);
});

export const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {});
