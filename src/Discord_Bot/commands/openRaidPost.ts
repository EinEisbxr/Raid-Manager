import { CommandInteraction, EmbedBuilder } from 'discord.js';
import { cocClient } from '../config.js';

export const data = {
    name: 'open_raid_post',
    description: 'Open an invitation for players to join your raid',
    options: [
        {
            name: 'clan_tag',
            description: 'The tag of the clan',
            type: 3,
            required: true,
            autocomplete: true,
        },
        {
            name: 'available_spots',
            description: 'The number of available spots in the raid',
            type: 4,
            required: true,
            autocomplete: false,
        },
        {
            name: 'skill_level',
            description: 'The skill level you would rate yourself',
            type: 3,
            required: true,
            autocomplete: true,
        },
        {
            name: 'contact',
            description: 'The number of accounts you want to raid with',
            type: 3,
            required: true,
            autocomplete: false,
        },
        {
            name: 'cg_donation',
            description: 'The amount of Clangold you want to donate',
            type: 3,
            required: true,
            autocomplete: true,
        },
        {
            name: 'additional_info',
            description: 'Any additional information you want to provide',
            type: 3,
            required: false,
            autocomplete: false,
        },
    ],
};

export async function execute(interaction: CommandInteraction) {
    try {
        let clanTag: string;
        let availableSpots: number;
        let skillLevel: string;
        let contact: string;
        let cgDonation: string;
        let additionalInfo: string;
        let clanName: string;
        let clanThumbnail: string;

        try {
            clanTag = interaction.options.get('clan_tag')?.value as string;
            availableSpots = interaction.options.get('available_spots')
                ?.value as number;
            skillLevel = interaction.options.get('skill_level')
                ?.value as string;
            contact = interaction.options.get('contact')?.value as string;
            cgDonation = interaction.options.get('cg_donation')
                ?.value as string;
            additionalInfo = interaction.options.get('additional_info')
                ?.value as string;
        } catch (error) {
            await interaction.reply({
                content: `Only write valid values for the options. Please try again.`,
                ephemeral: true,
            });
            return;
        }

        try {
            clanName = (await cocClient.getClan(clanTag)).name;
            clanThumbnail = (await cocClient.getClan(clanTag)).badge.large;
        } catch (err) {
            await interaction.reply({
                content: `Could not get any clan data for ${clanTag}. Please check the clan tag and try again.`,
                ephemeral: true,
            });
            return;
        }
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Raid Matcher - Open Raid Spots')
            .setThumbnail(clanThumbnail)
            .addFields([
                { name: 'Clan', value: `${clanName} -- ${clanTag}` },
                { name: 'Availble Slots', value: availableSpots.toString() },
                { name: 'Skill Level', value: skillLevel },
                { name: 'Contact', value: contact },
                { name: 'Clangold Donation', value: cgDonation },
            ]);

        if (additionalInfo) {
            embed.addFields({ name: 'Additional Info', value: additionalInfo });
        }

        embed.setTimestamp();

        await interaction.reply({
            embeds: [embed],
        });
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content:
                'An error occurred while posting your raid service. Please try again.',
            ephemeral: true,
        });
    }
}
