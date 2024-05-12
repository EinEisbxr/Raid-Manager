import { startBot } from "./Discord_Bot/bot.js";
import { PrismaClient } from "@prisma/client";
import { clearOldDatabaseEntries } from "./Discord_Bot/functions/clearOldDatabaseEntries.js";

export const prisma = new PrismaClient() as any;

export const client = await startBot();

setInterval(async () => {
    await clearOldDatabaseEntries();
}, 1000 * 60 * 60 * 24);
