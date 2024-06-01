import { CommandInteraction } from "discord.js";
import { prisma } from "../../index.js";
import { getRaidData } from "../../CoC_API/raidFunctions.js";
import { EmbedBuilder } from "discord.js";
import { generatePageButtons } from "../functions/generateButtons.js";

interface ExistingClan {
    id: number;
    tag: any;
    guildID: any;
    maxCapitalPeak: number;
    maxBarbarianCamp: number;
    maxWizardValley: number;
    maxBalloonLagoon: number;
    maxBuildersWorkshop: number;
    maxDragonCliffs: number;
    maxGolemQuarry: number;
    maxSkeletonPark: number;
    maxGoblinMines: number;
    [key: string]: number;
}

export const data = {
    name: "get_raid_fails",
    description: "Get the raid fails for the specified clan",
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
        await interaction.deferReply();

        const clanTag = interaction.options.get("clan_tag")?.value as string;
        const existingClan = await prisma.clan.findFirst({
            where: {
                tag: clanTag,
                guildID: interaction.guildId ?? "",
            },
        });

        if (!existingClan) {
            await interaction.reply({
                content: `Clan with tag ${clanTag} not found. Please check the clan tag or use the \`/setup_clan\` command to set up the clan.`,
                ephemeral: true,
            });
            return;
        }

        const districtMapping: { [key: string]: string } = {
            "Capital Peak": "maxCapitalPeak",
            "Barbarian Camp": "maxBarbarianCamp",
            "Wizard Valley": "maxWizardValley",
            "Balloon Lagoon": "maxBalloonLagoon",
            "Builders Workshop": "maxBuildersWorkshop",
            "Dragon Cliffs": "maxDragonCliffs",
            "Golem Quarry": "maxGolemQuarry",
            "Skeleton Park": "maxSkeletonPark",
            "Goblin Mines": "maxGoblinMines",
        };

        const raidData = await getRaidData(clanTag);
        if (raidData?.items?.length === 0 || raidData === null) {
            await interaction.reply({
                content: `Could not get any clan data for ${clanTag}. Please check the clan tag and try again.`,
                ephemeral: true,
            });
            return;
        }

        const attacks = raidData.items[0].attackLog;
        let embeds = [];

        for (let i = 0; i < attacks.length; i++) {
            const attack = attacks[i];
            for (let j = 0; j < attack.districts.length; j++) {
                const district = attack.districts[j];
                const districtName = districtMapping[district.name];

                const existingClan = (await prisma.clan.findFirst({
                    where: {
                        tag: clanTag,
                        guildID: interaction.guildId ?? "",
                    },
                })) as ExistingClan;

                if (
                    districtName &&
                    district.attackCount > existingClan[districtName]
                ) {
                    const embed = new EmbedBuilder()
                        .setTitle(`Fail on ${district.name} in Raid ${i + 1}`)
                        .setColor("#0099ff");

                    for (let k = 0; k < district.attackCount; k++) {
                        embed.addFields([
                            {
                                name: `Attack ${district.attackCount - k}`,
                                value: `Attacker: ${district.attacks[k].attacker.name}, destruction: ${district.attacks[k].destructionPercent}%`,
                                inline: false,
                            },
                        ]);
                    }

                    embeds.push(embed);
                }
            }
        }

        if (embeds.length === 0) {
            await interaction.editReply({
                content: `No raid fails found for clan ${clanTag}`,
            });
            return;
        }

        const maxEmbedsPerMessage = 3;
        let pages: EmbedBuilder[][] = [];
        let currentPage: EmbedBuilder[] = [];

        // Store the embeds in the pages array
        for (let i = 0; i < embeds.length; i++) {
            if (currentPage.length < maxEmbedsPerMessage) {
                currentPage.push(embeds[i]);
            } else {
                pages.push(currentPage);
                currentPage = [embeds[i]];
            }
        }

        if (currentPage.length > 0) {
            pages.push(currentPage);
        }

        // save to database
        const createdRecord = await prisma.pageButton.create({
            data: {
                currentPage: 1,
                pages: JSON.stringify(pages),
                creation: new Date(),
                clanTag: clanTag,
            },
        });
        prisma.$disconnect();

        const buttons = await generatePageButtons(createdRecord);

        interaction.editReply({
            content: `Showing raid fails for clan ${clanTag}; Page (1/${pages.length})`,
            embeds: pages[0],
            components: [
                {
                    type: 1,
                    components: buttons,
                },
            ],
        });
    } catch (error) {
        console.error(error);
        await interaction.editReply({
            content:
                "An internal error occured. Please contact EinEisbär | Felix",
        });

        return;
    }
}
