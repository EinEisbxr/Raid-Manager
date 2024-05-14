import { CommandInteraction } from "discord.js";
import { getRaidData } from "../../CoC_API/raidFunctions.js";
import { EmbedBuilder } from "discord.js";

export const data = {
    name: "get_current_raid_stats",
    description: "Get the current raid stats of a clan",
    options: [
        {
            name: "clan_tag",
            description: "The tag of the clan",
            type: 3,
            required: true,
            autocomplete: true,
        },
    ],
};

export async function execute(interaction: CommandInteraction) {
    try {
        const clanTag = interaction.options.get("clan_tag")?.value as string;

        let raidData;
        try {
            raidData = await getRaidData(clanTag);
        } catch (error) {
            await interaction.reply({
                content: `Could not get any clan data for ${clanTag}. Please check the clan tag and try again.`,
                ephemeral: true,
            });
            return;
        }

        if (raidData?.items?.length === 0 || raidData === null) {
            await interaction.reply({
                content: `Could not get any clan data for ${clanTag}. Please check the clan tag and try again.`,
                ephemeral: true,
            });
            return;
        }

        // Calculate the average attacks per district
        let attackCountsPerDistrict: { [key: string]: number[] } = {};
        for (const item of raidData.items[0].attackLog) {
            for (let i = 0; i < item.districts.length; i++) {
                const count = item.districts[i].attackCount;
                const district = item.districts[i].name;

                if (count === 0) {
                    continue;
                }

                if (!attackCountsPerDistrict[district]) {
                    attackCountsPerDistrict[district] = [];
                }
                attackCountsPerDistrict[district].push(count);
            }
        }

        let averageAttacks: { [key: string]: number } = {};
        for (const district in attackCountsPerDistrict) {
            const attacks = attackCountsPerDistrict[district];
            const sum = attacks.reduce((a, b) => a + b, 0);
            const average = sum / attacks.length;
            averageAttacks[district] = average;
        }

        // Create a Discord embed
        const embedAverage = new EmbedBuilder()
            .setTitle(`Average Attacks Per District for Clan ${clanTag}`)
            .setColor("#0099ff");

        for (const district in averageAttacks) {
            const average = averageAttacks[district];
            embedAverage.addFields([
                {
                    name: district,
                    value: `${average.toFixed(2)} attacks`,
                    inline: true,
                },
            ]);
        }

        let attackCounts: { [key: string]: number } = {
            "8": 0,
            "7": 0,
            "6": 0,
            "5": 0,
            "4": 0,
            "3": 0,
            "2": 0,
            "1": 0,
        };

        const attacks = raidData.items[0].attackLog;

        for (const attack of attacks) {
            for (const district of attack["districts"]) {
                const attackCount = district["attackCount"];

                if (attackCount >= 1 && attackCount <= 6) {
                    attackCounts[attackCount.toString()] += 1;
                }
            }
        }

        const embedAttackCount = new EmbedBuilder()
            .setTitle(`Overview of attack counts for Clan ${clanTag}`)
            .setColor("#0099ff");

        let districtCount = 0;
        for (let i = 0; i < attacks.length; i++) {
            districtCount += attacks[i].districts.length;
        }

        for (const attackCount in attackCounts) {
            if (attackCounts[attackCount] === 0) {
                continue;
            }

            embedAttackCount.addFields([
                {
                    name: `Districts with ${attackCount} attacks`,
                    value: `${attackCounts[attackCount]} districts -- ${(
                        (attackCounts[attackCount] / districtCount) *
                        100
                    ).toFixed(2)}%`,
                    inline: false,
                },
            ]);
        }

        // Reply with the embed
        await interaction.reply({ embeds: [embedAverage, embedAttackCount] });
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
