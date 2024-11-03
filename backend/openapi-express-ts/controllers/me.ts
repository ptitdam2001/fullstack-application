import { PrismaClient } from "@prisma/client";
import type { Response, Request, NextFunction } from "express";
import { Context } from "openapi-backend";

const prisma = new PrismaClient({
    omit: {
        user: {
            password: true,
        },
    },
});

export const me = async (ctx: Context, _: Request, res: Response, next: NextFunction) => {
    const userId = ctx.security.jwtAuth.data;
    const existingUser = await prisma.user.findUnique({ where: { id: userId } });

    if (!existingUser) {
        return next(Error("User not found"));
    }

    res.status(200).json(existingUser)
}