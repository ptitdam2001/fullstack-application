import { Router } from "express";
import type { Request, Response } from "express";
import { PrismaClient, type User } from "@prisma/client";
import type { ErrorOutput } from "../types";
import { authenticateTokenMiddleware } from "../middleware/authentication";

const router = Router();
const prisma = new PrismaClient({
  omit: {
    user: {
      password: true
    }
  }
})

type UserOutput = Omit<User, 'password'>
type UserOrErrorOutput = UserOutput | ErrorOutput

router.param("id", (req: Request, _, next, id) => {
  req.userId = id;
  next();
});

router.get("/", authenticateTokenMiddleware, async (_: Request, res: Response<UserOutput[]>) => res.send(await prisma.user.findMany({})))

router.get("/:id", authenticateTokenMiddleware, async (req: Request, res: Response<UserOrErrorOutput>) => {
  if (!req.userId) {
    return res.status(403).send({
      message: "Bad request - id not provided",
    });
  }

  const found = await prisma.user.findUnique({
    where: {
      id: req.userId
    }
  })

  return found
    ? res.status(200).send(found)
    : res.status(404).send({
      message: "User not found",
    });
});

router.post("/", authenticateTokenMiddleware, async (req: Request<Partial<Omit<User, 'id'>>>, res: Response<UserOrErrorOutput>) => {
  try {
    const newUser = await prisma.user.create({ data: req.body })
    return res.status(200).send(newUser);
  } catch (err) {
    return res.status(500).send({
      message: JSON.stringify(err)
    })
  }

});

router.patch("/:id", authenticateTokenMiddleware, async (req: Request<Partial<Omit<User, 'id'>>>, res: Response<UserOrErrorOutput>) => {
  if (!req.userId) {
    return res.status(403).send({
      message: "Bad request - id not provided",
    });
  }

  const result = await prisma.user.update({
    where: {
      id: req.userId,
    },
    data: req.body
  });
  
  if (!result) {
    return res.status(404).send({
      message: 'User does not exist'
    })
  }

  res.send(result);
});

router.delete("/:id", authenticateTokenMiddleware, async (req: Request, res: Response<null|ErrorOutput>) => {
  if (!req.userId) {
    return res.status(403).send({
      message: "Bad request - id not provided",
    });
  }

  try {
    await prisma.user.delete({
      where: {
        id: req.userId
      }
    })
    return res.status(204).send()
  } catch (err) {
    return res.status(404).send({
      message: JSON.stringify(err)
    })
  }
});

export default router;
