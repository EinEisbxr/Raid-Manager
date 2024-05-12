import { startBot } from "./Discord_Bot/bot.js";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient() as any;

export const client = await startBot();
