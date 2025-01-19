// Third party imports
import { connect, MongooseError } from "mongoose";

// User imports
import app from "./app";
import { errorLogger, INFINITE, retryAsync } from "@mono/utils";
import "./redis";

const { MONGO_CONN, PORT } = process.env;

// Error catching net
const ERR_TYPES = ["uncaughtException", "unhandledRejection"] as const;
ERR_TYPES.forEach((errType: (typeof ERR_TYPES)[number]) => {
  process.on(errType, (err) => {
    errorLogger(err, `${errType.toUpperCase()}!!!`);
  });
});

const initServer = async () => {
  try {
    if (!MONGO_CONN) {
      throw new Error("Unable to access MONGO_CONN env variable : server.ts");
    }
    await retryAsync(() => connect(MONGO_CONN), INFINITE, 5, 20);
    console.log("MongoDB connected successfully. ✅ ✅ ✅");

    const port: number = parseInt(PORT ?? "4000");
    app.listen(port, () => {
      console.log(`App listening on port : ${port}`);
    });
  } catch (err) {
    errorLogger(err, true);
  }
};

initServer();
