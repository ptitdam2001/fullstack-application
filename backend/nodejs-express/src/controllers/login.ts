import { Router } from "express";
import type { Response, Request } from "express";

const router = Router();

router.post("/", (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Error - Bad email or password",
    });
  }

  // find user with email
  const user = {
    lastname: "doe",
    firstname: "john",
  };

  // Not found user
  if (!user) {
    return res.status(404).json({
      message: "Error - user not found",
    });
  }
});
