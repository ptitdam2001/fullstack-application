import cors from 'cors';
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import morgan from 'morgan';
import jwt, { Secret } from 'jsonwebtoken';

import { OpenAPIBackend, type Request as RequestOpenApi } from 'openapi-backend';
import helmet from "helmet";

import * as userHandlers from './controllers/users'
import * as loginHandlers from './controllers/login'
import * as meHandlers from './controllers/me'
import * as teamHandlers from './controllers/teams'
import * as userTeamHandler from './controllers/userTeam'
import * as playerHandler from './controllers/player'

import { logger } from './config/logger';
import addFormats from 'ajv-formats';

// configures dotenv to work in your application
dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.use(express.json())
app.use(helmet())
app.use(cors({
  // origin: 'http://localhost:5173',
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
  // credentials: true,
}))

const api = new OpenAPIBackend({
  definition: '../openapi.yml',
  customizeAjv: (ajv: any) => {
    // add standard formats (date-time, email, hostname, ipv4, etc.)
    addFormats(ajv);

    // custom formats (øsee https://ajv.js.org/guide/formats.html for more details)
    ajv.addFormat('color', /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
    ajv.addFormat('score', {type: 'number', minimum: 0, maximum: 100});

    return ajv;
  },
  handlers: {
    ...userHandlers,
    ...loginHandlers,
    ...meHandlers,
    ...teamHandlers,
    ...userTeamHandler,
    ...playerHandler,
    validationFail: (c, _: Request, res: Response) => res.status(400).json({ err: c.validation.errors }),
    notFound: (c, _: Request, res: Response) => res.status(404).json({ err: 'not found', operation: c.operation?.operationId, status: 404, path: c.operation?.path, method: c.operation?.method }),
    methodNotAllowed: (_, _1, res: Response) => res.status(405).json({ status: 405, err: "Method not allowed" }),
    notImplemented: (_, _1, res: Response) => res.status(404).json({ status: 501, err: "No handler registered for operation" }),
    unauthorizedHandler: (_, _0, res: Response) => res.status(401).json({ status: 401, err: "Please authenticate first" })
  },
  
});

api.registerSecurityHandler("jwtAuth", (ctx) => {
  const authHeader = ctx.request.headers["authorization"];
  if (!authHeader) {
    throw new Error("Missing authorization header");
  }
  const token = authHeader.replace("Bearer ", '');
  return jwt.verify(token, process.env.JWT_SECRET as Secret);
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