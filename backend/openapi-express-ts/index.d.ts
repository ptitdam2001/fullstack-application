declare global {
  namespace NodeJS {
    interface ProcessEnv extends Dict<string> {
      JWT_SECRET: string;
      JWT_EXPIRE: string;
      PORT: string;
    }
  }
}

export {}
