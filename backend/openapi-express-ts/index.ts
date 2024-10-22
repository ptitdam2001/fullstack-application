import cors from 'cors';
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import OpenAPIBackend from 'openapi-backend';
import morgan from 'morgan';

import type { Request as RequestOpenApi } from 'openapi-backend';
import helmet from "helmet";

import * as userHandlers from './controllers/users'
import { logger } from './config/logger';

// configures dotenv to work in your application
dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.use(express.json())
app.use(helmet())
app.use(cors(
))

const api = new OpenAPIBackend({
  definition: '../openapi.yml',
  handlers: {
    ...userHandlers,
    validationFail: async (c, req: Request, res: Response) =>
      res.status(400).json({ err: c.validation.errors }),
    notFound: async (c, req: Request, res: Response) => res.status(404).json({ err: 'not found', operation: c.operation?.operationId, status: 404, path: c.operation?.path, method: c.operation?.method }),
  },
});

api.init();

// logging
app.use(morgan('combined')); 

// use as express middleware
app.use((req: RequestOpenApi, res: Request) => api.handleRequest(req, req, res));


app.listen(PORT, () => { 
  logger.info("Server running at PORT: %d", PORT); 
}).on("error", (error) => {
  // gracefully handle error
  throw new Error(error.message);
});