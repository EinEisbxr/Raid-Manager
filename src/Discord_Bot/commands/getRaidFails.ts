import { ButtonStyle, CommandInteraction } from "discord.js";
import { prisma } from "../../index.js";
import { getRaidData } from "../../CoC_API/raidFunctions.js";
import { EmbedBuilder } from "discord.js";
import { generatePageButtons } from "../functions/generateButtons.js";
import { APIButtonComponentWithCustomId } from "discord.js";

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
    const clanTag = interaction.options.get("clan_tag")?.value as string;
    const existingClan = await prisma.clan.findFirst({
        where: {
            tag: clanTag,
            guildID: interaction.guildId,
        },
    });

    if (!existingClan) {
        await interaction.reply({
            content: `Clan with tag ${clanTag} not found. Please use the \`/setup_clan\` command to set up the clan.`,
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
    const attacks = raidData.items[0].attackLog;
    let embeds = [];

    for (let i = 0; i < attacks.length; i++) {
        const attack = attacks[i];
        for (let j = 0; j < attack.districts.length; j++) {
            const district = attack.districts[j];
            const districtName = districtMapping[district.name];
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

    const maxEmbedsPerMessage = 5;
    const totalEmbeds = embeds.length;
    let messageCount = 0;

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

    // save to database
    const createdRecord = await prisma.PageButton.create({
        data: {
            currentPage: 1,
            pages: JSON.stringify(pages),
            creation: new Date(),
            clanTag: clanTag,
        },
    });

    const buttons = await generatePageButtons(createdRecord);

    interaction.reply({
        content: `Showing raid fails for clan ${clanTag}; Page (1/${
            pages.length - 1
        })`,
        embeds: pages[0],
        components: [
            {
                type: 1,
                components: buttons,
            },
        ],
    });
}
