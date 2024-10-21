import type { NextFunction, Response, Request } from "express"
import jwt from 'jsonwebtoken'
import { prisma } from "../config/prisma"

export const authenticateTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) {
        return res.sendStatus(401)
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
            data: string;
        }

        // Get information of user
        const current = await prisma.user.findUnique({
            omit: {
                password: true,
            },
            where: { id: decoded.data },
        });

        req.user = current
        return next()
    } catch (err) {
        return res.sendStatus(403)
    }
}