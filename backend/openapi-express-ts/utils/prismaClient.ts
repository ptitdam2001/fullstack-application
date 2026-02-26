import "dotenv/config";
import { PrismaClient } from "../config/prisma/client";

const prisma = new PrismaClient();

export { prisma };