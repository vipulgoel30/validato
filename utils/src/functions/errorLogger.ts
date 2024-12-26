export function errorLogger(err: any): void;
export function errorLogger(err: any, message: string): void;
export function errorLogger(err: any, isPriority: boolean): void;
export function errorLogger(err: any, message: string, isPriority: boolean): void;

export function errorLogger(err: any, arg1?: string | boolean, arg2?: boolean): void {
  const message: string = typeof arg1 === "string" ? arg1 : err instanceof Error ? err.message : "Unknown error.";
  const isPriority: boolean = typeof arg1 === "boolean" ? arg1 : !!arg2;

  if (process.env.NODE_ENV === "prod") {
    // TODO add the fetch to error service
  } else {
    console.log(`\x1b[3${isPriority ? "1" : "3"}m%s\x1b[0m`, message);
    console.log(err);
  }
}
