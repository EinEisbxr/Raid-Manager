import { startBot } from './Discord_Bot/bot.js';
import { clearOldDatabaseEntries } from './Discord_Bot/functions/clearOldDatabaseEntries.js';
import pg from 'pg';
const { Pool } = pg;
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import http from 'http';

// Set up an HTTP server for the Koyeb health check
const healthCheckServer = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('OK');
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

healthCheckServer.listen(8000, '0.0.0.0', () => {
    console.log('Health check server is listening on port 8000');
});

const connectionString = `${process.env.DATABASE_URL}`;

console.log(`Connecting to database at ${connectionString}`);

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });

export const client = await startBot();

setInterval(async () => {
    await clearOldDatabaseEntries();
}, 1000 * 60 * 60 * 24);
