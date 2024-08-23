import type { Express } from 'express'
import express from 'express'
import cors from 'cors';
import expressWinston from "express-winston";
import { logger } from "./logger";
import { getControllers } from './routers';
import helmet from 'helmet';

const App: Express = express();

App.use(cors({
    credentials: true,
}))
App.use(express.json())
App.use(helmet())
App.use(
    expressWinston.logger({
      winstonInstance: logger,
      meta: false, // control whether you want to log the meta data about the request (default is true)
      msg: "HTTP {{req.method}} {{req.url}} - {{res.statusCode}}", // customize the default logging message
    })
  );

const controllers = await getControllers(process.env.BASE_PATH || '/')
App.use(controllers)

export default App