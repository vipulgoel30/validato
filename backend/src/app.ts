// Third party imports
import express, { Express, Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";

// User imports
import globalErrorController from "./controllers/globalErrorController";
import { createNotFoundError } from "@mono/utils";
import authRouter from "./routes/auth";
import adminRouter from "./routes/admin";

const app: Express = express();

// TODO check after deployment
// app.set("trust proxy", true);

// parse the incoming payload when the content-type : application/json
app.use(express.json());

// express-rate-limit : limit the no of request coming from certain IP address
if (process.env.NODE_ENV !== "dev") {
  app.use(rateLimit());
}

// express-mongo-sanitize : sanitize the incoming payload for mongoDB specific command
app.use(mongoSanitize());

// helmet : add the security headers to the response
app.use(helmet());

app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/auth", authRouter);

app.use("*", (req: Request, res: Response, next: NextFunction) => {
  next(
    createNotFoundError("Oops! We couldn't find what you were looking for.", {
      message: `We don't handle this route ${req.method}: ${req.originalUrl}`,
    })
  );
});

app.use(globalErrorController);

export default app;

// (async () => {
//   try {
//     const user = await User.create({
//       name: "vipyl",
//       email: "vipul@gmail.com",
//       password: "test1234",
//     });
//     console.log(user);
//   } catch (err) {
//     console.log(err);
//   }
// })();

