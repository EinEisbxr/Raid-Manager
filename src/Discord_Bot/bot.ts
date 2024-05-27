import {
    Client,
    ComponentType,
    AutocompleteInteraction,
    ActivityType,
} from "discord.js";
import { config } from "./config.js";
import { commands } from "./commands/index.js";
import { deployCommands } from "./deploy-commands.js";
import {
    handleAutocomplete,
    reloadAutocomplete,
} from "./handlers/handleAutocomplete.js";
import { handleButtons } from "./handlers/handleButtons.js";
import { clearMessages } from "./functions/clearMessages.js";
import cron from "node-cron";

export function startBot() {
    const client = new Client({
        intents: ["Guilds", "GuildMessages", "DirectMessages"],
    });

    client.once("ready", async () => {
        client.user?.setActivity({
            name: "RAID: Shadow Legends",
            type: ActivityType.Playing,
        });

        await reloadAutocomplete();

        console.log("Bot is ready");
    });

    client.on("ready", () => {
        // Schedule task to run every Monday at 11:59 PM
        cron.schedule("59 23 * * 1", () => {
            clearMessages(client, "1230830415535804446");
            clearMessages(client, "1230829142736506890");
        });
    });

    client.on("guildCreate", async (guild) => {
        await deployCommands({ guildId: guild.id });
    });

    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isCommand()) {
            return;
        }
        const { commandName } = interaction;
        if ((commands as { [key: string]: any })[commandName]) {
            (commands as { [key: string]: any })[commandName].execute(
                interaction
            );
        }
    });

    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isAutocomplete()) {
            return;
        }
        handleAutocomplete(interaction);
    });

    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isButton()) {
            return;
        }
        handleButtons(interaction);
    });

    client.login(config.DISCORD_TOKEN);

    return client;
}
