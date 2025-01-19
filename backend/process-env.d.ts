
  declare global{
    namespace NodeJS{
      interface ProcessEnv{
        [key:string] : string;
          PORT : string
NODE_ENV : string
MONGO_USER : string
MONGO_PASS : string
FRONTEND_URL : string
REDIS_CLIENT : string
MONGO_CONN : string
CRYPTO_ALGORITHM : string
CRYPTO_SECRET_KEY : string
CRYPTO_IV : string
ADMIN_KEY : string
JWT_ALGORITHM : string
JWT_SECRET_KEY : string
      }
    }
  }

  export {};
  