import dotenv from "dotenv";

dotenv.config();

const { DISCORD_TOKEN, DISCORD_CLIENT_ID } = process.env;

export const ADMIN_ROLE_IDS: string[] = process.env.ADMIN_ROLE_IDS
    ? process.env.ADMIN_ROLE_IDS.split(",").map((id) => id.trim())
    : [];

if (!DISCORD_TOKEN || !DISCORD_CLIENT_ID) {
    throw new Error("Missing environment variables");
}

export const { API_TOKEN } = process.env;

export const config = {
    DISCORD_TOKEN,
    DISCORD_CLIENT_ID,
};
