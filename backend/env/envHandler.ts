// Core imports
import { readFile, writeFile } from "fs/promises";

type StringArrObj = Record<string, string[]>;
type StringObj = Record<string, string>;

const processCommandLineArgs = (): StringArrObj => {
  return process.argv.reduce<StringArrObj>((acc, arg: string) => {
    const splitAt: number = arg.indexOf("=");
    return { ...acc, ...(splitAt !== -1 && { [`${arg.slice(0, splitAt)}`]: arg.slice(splitAt + 1).split(",") }) };
  }, {});
};

const handleFile = async (file: string, isExpand: boolean, payload: StringObj): Promise<StringObj> => {
  try {
    const content: string = (await readFile(file, "utf-8")).trim();
    if (content.length) {
      const properties = content.split("\n").filter((propertie) => propertie.trim().length > 0);
      for (const propertie of properties) {
        const splitAt = propertie.indexOf("=");
        if (splitAt === -1) {
          throw new Error("Invalid format. Expected format : {KEY} = {VALUE}");
        }
        const key = propertie.slice(0, splitAt).trim();
        let value = propertie.slice(splitAt + 1).trim();
        if (isExpand) {
          value = value.replace(
            new RegExp(/\${([\w]*)}/, "g"),
            (match: string, group: string): string => payload[group] ?? match
          );
        }
        payload[key] = value;
      }
    }
  } catch (err) {
    let message: string = "Uhhh!!! Something went wrong";
    if (err instanceof Error) {
      message = err.message;
      if (err.message.includes("no such file")) {
        message = "No such file exists.";
      }
    }

    console.log("\x1b[31m%s\x1b[0m", `Error in processing file : ${file}. ${message}`);
  }
  return payload;
};

const generateEnv = (payload: StringObj) => {
  const content: string = Object.entries(payload)
    .map(([key, value]: [string, string]) => `${key} = ${value}`)
    .join("\n");
  writeFile("./.env", content, "utf-8");
};

const generateProcessEnv = (payload: StringObj) => {
  const template: string = `
  declare global{
    namespace NodeJS{
      interface ProcessEnv{
        [key:string] : string;
          {PLACEHOLDER}
      }
    }
  }

  export {};
  `;

  const content: string = Object.keys(payload)
    .map((key: string) => `${key} : string`)
    .join("\n");
  writeFile("./process-env.d.ts", template.replace("{PLACEHOLDER}", content), "utf-8");
};

(async () => {
  let payload: StringObj = {};

  const { "--env": env, "--env-expand": envExpand }: { "--env"?: string[]; "--env-expand"?: string[] } =
    processCommandLineArgs();

  env &&
    (await Promise.all(
      env?.map(async (file: string) => {
        payload = await handleFile(file, false, payload);
      })
    ));

  envExpand &&
    (await Promise.all(
      envExpand?.map(async (file: string) => {
        payload = await handleFile(file, true, payload);
      })
    ));

  generateEnv(payload);
  generateProcessEnv(payload);
})();
