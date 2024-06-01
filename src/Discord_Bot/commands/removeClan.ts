import { CommandInteraction } from "discord.js";
import { prisma } from "../../index.js";

export const data = {
    name: "remove_clan",
    description: "Remove your clan from the database",
    options: [
        {
            name: "clan_tag",
            description: "The tag of your clan",
            type: 3,
            required: true,
            autocomplete: true,
        },
    ],
};

export async function execute(interaction: CommandInteraction) {
    try {
        const clanTag = interaction.options.get("clan_tag")?.value as string;

        const clan = await prisma.clan.findFirst({
            where: {
                tag: clanTag,
            },
        });

        if (!clan) {
            interaction.reply(`Clan ${clanTag} not found in the database`);
            return;
        }

        const autocompleteName = clan.autocompleteName;

        // Remove the clan from the database
        await prisma.clan.delete({
            where: {
                id: clan.id,
            },
        });

        interaction.reply(
            `Clan ${autocompleteName} has been removed from the database`
        );
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content:
                "An internal error occured. Please contact EinEisbär | Felix",
            ephemeral: true,
        });

        return;
    }
}
