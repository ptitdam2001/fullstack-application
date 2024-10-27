// to make the file a module and avoid the TypeScript error
export { }

declare global {
  namespace NodeJS {
    export interface ProcessEnv extends Dict<string> {
      JWT_SECRET: string;
      JWT_EXPIRE: string;
    }
  }
}
