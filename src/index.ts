import { startBot } from "./Discord_Bot/bot.js";
import { clearOldDatabaseEntries } from "./Discord_Bot/functions/clearOldDatabaseEntries.js";
import pg from "pg";
const { Pool } = pg;
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

console.log(`Connecting to database at ${connectionString}`);

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });

export const client = await startBot();

setInterval(async () => {
    await clearOldDatabaseEntries();
}, 1000 * 60 * 60 * 24);
