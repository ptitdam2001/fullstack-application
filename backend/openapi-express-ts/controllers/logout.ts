import { Request, Response } from "express";
import { Context } from "openapi-backend";
import type { ErrorOutput } from "./types";

export const logout = async (_: Context, __: Request, res: Response<ErrorOutput | void>) => {
  try {
    return res.status(200).send();
  } catch (err) {
    return res.status(500).json({ message: "Error! Something went wrong.", status: 500 });
  }
};
