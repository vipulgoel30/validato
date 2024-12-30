
  declare global{
    namespace NodeJS{
      interface ProcessEnv{
        [key:string] : string;
          PORT : string
NODE_ENV : string
MONGO_USER : string
MONGO_PASS : string
FRONTEND_URL : string
MONGO_CONN : string
CRYPTO_SECRET_KEY : string
CRYPTO_IV : string
ADMIN_KEY : string
      }
    }
  }

  export {};
  