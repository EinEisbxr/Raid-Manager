import { startBot } from "./Discord_Bot/bot.js";
import { PrismaClient } from "@prisma/client";
import { clearOldDatabaseEntries } from "./Discord_Bot/functions/clearOldDatabaseEntries.js";
import net from "net";

export const prisma = new PrismaClient() as any;

export const client = await startBot();

setInterval(async () => {
    await clearOldDatabaseEntries();
}, 1000 * 60 * 60 * 24);

// Create a TCP server
const server = net.createServer((socket) => {
    socket.write("Echo server\r\n");
    socket.pipe(socket);
});

// Listen for a connection on port 8000
server.listen(8000, "127.0.0.1");
