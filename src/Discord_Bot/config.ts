import dotenv from "dotenv";
import { Client } from "clashofclans.js";

dotenv.config();

const { DISCORD_TOKEN, DISCORD_CLIENT_ID } = process.env;

export const ADMIN_ROLE_IDS: string[] = process.env.ADMIN_ROLE_IDS
    ? process.env.ADMIN_ROLE_IDS.split(",").map((id) => id.trim())
    : [];

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID) {
    throw new Error("Missing environment variables");
}

export const COC_API_TOKEN = process.env.COC_API_TOKEN ?? "";

export const cocClient = new Client({ keys: [COC_API_TOKEN] });

export const config = {
    DISCORD_TOKEN,
    DISCORD_CLIENT_ID,
};
