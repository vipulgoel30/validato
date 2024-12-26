
  declare global{
    namespace NodeJS{
      interface ProcessEnv{
        [key:string] : string;
          PORT : string
NODE_ENV : string
MONGO_USER : string
MONGO_PASS : string
MONGO_CONN : string
      }
    }
  }

  export {};
  