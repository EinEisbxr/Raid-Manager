import { CommandInteraction, EmbedBuilder } from "discord.js";
import { cocClient } from "../config.js";

export const data = {
    name: "raid_service_post",
    description: "Post a raid service for your clan",
    options: [
        {
            name: "player_tag",
            description: "The tag of your main account",
            type: 3,
            required: true,
        },
        {
            name: "skill_level",
            description: "The skill level you would rate yourself",
            type: 3,
            required: true,
            autocomplete: true,
        },
        {
            name: "contact",
            description: "The contact information for your raid service",
            type: 3,
            required: true,
        },
        {
            name: "number_of_accounts",
            description: "The number of accounts you want to raid with",
            type: 4,
            required: true,
        },
        {
            name: "cg_donation",
            description: "The amount of Clangold you want to donate",
            type: 3,
            required: true,
            autocomplete: true,
        },
        {
            name: "additional_info",
            description: "Any additional information you want to provide",
            type: 3,
            required: false,
        },
    ],
};

export async function execute(interaction: CommandInteraction) {
    try {
        const playerTag = interaction.options.get("player_tag")
            ?.value as string;
        const skillLevel = interaction.options.get("skill_level")
            ?.value as string;
        const contact = interaction.options.get("contact")?.value as string;
        const numberOfAccounts = interaction.options.get("number_of_accounts")
            ?.value as number;
        const cgDonation = interaction.options.get("cg_donation")
            ?.value as string;
        const additionalInfo = interaction.options.get("additional_info")
            ?.value as string;

        let playerName;
        try {
            playerName = (await cocClient.getPlayer(playerTag)).name;
        } catch (err) {
            await interaction.reply({
                content: `Could not get any player data for ${playerTag}. Please check the clan tag and try again.`,
                ephemeral: true,
            });
            return;
        }

        const embed = new EmbedBuilder()
            .setColor("#0099ff")
            .setTitle("Raid Service - Player looking for Clan")
            .addFields([
                { name: "Player Tag", value: `${playerName} -- ${playerTag}` },
                { name: "Skill Level", value: skillLevel },
                { name: "Contact", value: contact },
                {
                    name: "Number of Accounts",
                    value: numberOfAccounts.toString(),
                },
                { name: "Clangold Donation", value: cgDonation },
            ]);

        if (additionalInfo) {
            embed.addFields({ name: "Additional Info", value: additionalInfo });
        }

        embed.setTimestamp();

        await interaction.reply({
            embeds: [embed],
        });
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content:
                "An error occurred while posting your raid service. Please try again.",
            ephemeral: true,
        });
    }
}
