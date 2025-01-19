// Third party imports
import { createClient, type RedisClientType } from "redis";

// User imports
import { errorLogger, INFINITE, retryAsync } from "@mono/utils";

const { REDIS_CLIENT } = process.env;

const client: RedisClientType = createClient({ url: REDIS_CLIENT });

const initClient = async () => {
  try {
    await retryAsync<RedisClientType>(() => client.connect(), INFINITE, 5, 20);
    console.log("Redis connected successfully 😊 😊 😊");
  } catch (err) {
    errorLogger(err, "Unable to connect to redis : redis.ts", true);
  }
};

initClient();

export const setCache = (
  key: string,
  value: string,
  expirationS?: number
) => {};
