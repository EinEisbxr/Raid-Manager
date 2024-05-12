import { CommandInteraction } from "discord.js";

export const data = {
    name: "setup_clan",
    description: "Setup a clan for your server",
    options: [
        {
            name: "clan_tag",
            description: "The tag of the clan",
            type: 3,
            required: true,
            autocomplete: true,
        },
        {
            name: "capital_peak",
            description: "Specify the max. number of attacks",
            type: 4,
            required: true,
        },
        {
            name: "barbarian_camp",
            description: "Specify the max. number of attacks",
            type: 4,
            required: true,
        },
        {
            name: "wizard_valley",
            description: "Specify the max. number of attacks",
            type: 4,
            required: true,
        },
        {
            name: "balloon_lagoon",
            description: "Specify the max. number of attacks",
            type: 4,
            required: true,
        },
        {
            name: "builders_workshop",
            description: "Specify the max. number of attacks",
            type: 4,
            required: true,
        },
        {
            name: "dragon_cliffs",
            description: "Specify the max. number of attacks",
            type: 4,
            required: true,
        },
        {
            name: "golem_quarry",
            description: "Specify the max. number of attacks",
            type: 4,
            required: true,
        },
        {
            name: "skeleton_park",
            description: "Specify the max. number of attacks",
            type: 4,
            required: true,
        },
        {
            name: "goblin_mines",
            description: "Specify the max. number of attacks",
            type: 4,
            required: true,
        },
    ],
};

export async function execute(interaction: CommandInteraction) {
    await interaction.reply("Clan setup has been completed!");
}
