import type { User } from '@prisma/client';
import { Request as IRequest } from 'express/index'

// to make the file a module and avoid the TypeScript error
export { }

declare global {
  namespace Express {
    export interface Request {
      user?: Omit<User, 'password'> | null;
      userId?: string
    }
  }

  namespace NodeJS {
    export interface ProcessEnv extends Dict<string> {
      JWT_SECRET: string;
      JWT_EXPIRE: string;
      CRYPT_SALT: number;
    }
  }
}
