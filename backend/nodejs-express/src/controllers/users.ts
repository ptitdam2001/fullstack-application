import { Router } from "express";
import type { Request, Response } from "express";
import { logger } from "../config/logger";
import { UserService } from "../models/userService";

const router = Router();
const service = new UserService();

router.param("id", (req: Request, res, next, id) => {
  req.userId = id;
  next();
});

router.get("/", (_, res) => {
  res.send(service.getList());
});

router.get("/:id", (req: Request, res: Response) => {
  if (!req.userId) {
    return res.status(403).send({
      message: "Bad request - id not provided",
    });
  }
  const found = service.getOne(req.userId);
  return found
    ? res.status(200).send(found)
    : res.status(404).send({
        message: "User not found",
      });
});

router.post("/", (req: Request, res: Response) => {
  res.send(service.create(req.body));
});

router.patch("/:id", (req: Request, res: Response) => {
    if (!req.userId) {
        return res.status(403).send({
          message: "Bad request - id not provided",
        });
    }

    const result = service.update(req.userId, req.body)
    if (!result) {
        return res.status(404).send({
            message: 'User does not exist'
        })
    }

  res.send(result);
});

router.delete("/:id", (req: Request, res: Response) => {
    if (!req.userId) {
        return res.status(403).send({
          message: "Bad request - id not provided",
        });
    }

    try {
        service.delete(req.userId)
        return res.status(204).send()
    } catch (err) {
        return res.status(404).send({
            message: err
        })
    }
});

export default router;
