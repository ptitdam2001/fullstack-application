import { Router } from "express";
import type { Response, Request, NextFunction } from "express";
import { authenticateTokenMiddleware } from "../middleware/authentication";

const router = Router();

router.get("/", authenticateTokenMiddleware, (req: Request, res: Response, next: NextFunction) => 
  res.status(200).json(req.user)
);

export default router;
