import type { Response, Request } from "express";
import type { Context } from "openapi-backend";
import { prisma } from "../utils/prismaClient";

/** Returns the profile of the currently authenticated user. */
export const me = async (ctx: Context, _: Request, res: Response) => {
    const userId = ctx.security.jwtAuth.data;
    const existingUser = await prisma.user.findUnique({
        where: { id: userId },
        omit: { password: true },
    });

    if (!existingUser) {
        return res.status(404).json({ message: "User not found", status: 404 });
    }

    return res.status(200).json(existingUser);
}
