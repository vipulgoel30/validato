// Third party imports
import { connect } from "mongoose";

// User imports
import app from "./app";
import { errorLogger, INFINITE, retryAsync } from "@mono/utils";

const initServer = () => {
  try {
    if (!process.env.MONGO_CONN) throw new Error("Unable to access MONGO_CONN env variable : server.ts");
    retryAsync(() => connect(process.env.MONGO_CONN), INFINITE, 5, 20);
    console.log("MongoDB connected successfully. ✅ ✅ ✅");

    const port: number = parseInt(process.env.PORT ?? "4000");
    app.listen(port, () => {
      console.log(`App listening on port : ${port}`);
    });
  } catch (err) {
    errorLogger(err, true);
  }
};

initServer();
