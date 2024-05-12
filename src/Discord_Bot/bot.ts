import { Client, ComponentType, AutocompleteInteraction } from "discord.js";
import { config } from "./config.js";
import { commands } from "./commands/index.js";
import { deployCommands } from "./deploy-commands.js";
import { handleAutocomplete } from "./handlers/handleAutocomplete.js";
import { handleButtons } from "./handlers/handleButtons.js";

export function startBot() {
    const client = new Client({
        intents: ["Guilds", "GuildMessages", "DirectMessages"],
    });

    client.once("ready", () => {
        console.log("Discord bot is ready! 🤖");
    });

    client.once("ready", async () => {
        // Get all guilds the bot is connected to
        const guilds = client.guilds.cache;

        // Deploy commands to all guilds
        guilds.forEach(async (guild) => {
            await deployCommands({ guildId: guild.id });
        });

        console.log(
            "Bot is ready and commands have been deployed to all guilds."
        );
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
