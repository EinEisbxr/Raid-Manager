import { CommandInteraction } from "discord.js";
import { prisma } from "../../index.js";
import { GuildMemberRoleManager } from "discord.js";
import { ADMIN_ROLE_IDS } from "../config.js";
import { cocClient } from "../config.js";
import { reloadAutocomplete } from "../handlers/handleAutocomplete.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

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
    try {
        const member = interaction.member;
        if (!member) {
            await interaction.reply({
                content: "Member running the command not found.",
                ephemeral: true,
            });
            return;
        }
        const isAdmin = (member.roles as GuildMemberRoleManager).cache.some(
            (role) => ADMIN_ROLE_IDS.includes(role.id)
        );

        if (!isAdmin) {
            await interaction.reply({
                content: "You do not have permission to use this command.",
                ephemeral: true,
            });
            return;
        }

        const clanTag = interaction.options.get("clan_tag")?.value as string;
        const capitalPeak = interaction.options.get("capital_peak")
            ?.value as number;
        const barbarianCamp = interaction.options.get("barbarian_camp")
            ?.value as number;
        const wizardValley = interaction.options.get("wizard_valley")
            ?.value as number;
        const balloonLagoon = interaction.options.get("balloon_lagoon")
            ?.value as number;
        const buildersWorkshop = interaction.options.get("builders_workshop")
            ?.value as number;
        const dragonCliffs = interaction.options.get("dragon_cliffs")
            ?.value as number;
        const golemQuarry = interaction.options.get("golem_quarry")
            ?.value as number;
        const skeletonPark = interaction.options.get("skeleton_park")
            ?.value as number;
        const goblinMines = interaction.options.get("goblin_mines")
            ?.value as number;

        const clanName = await cocClient.getClan(clanTag).then((clan: any) => {
            return clan.name;
        });

        try {
            // Read and parse the JSON file
            let choices;
            const dirname = path.dirname(fileURLToPath(import.meta.url));
            const filePath = path.join(
                dirname,
                "../../../data/clanChoices.json"
            );
            try {
                choices = JSON.parse(fs.readFileSync(filePath, "utf8"));
            } catch (err) {
                choices = [];
            }

            // Check if the choice already exists
            if (!choices.some((choice: any) => choice.value === clanTag)) {
                // Add the choice to the array
                choices.push({
                    name: `${clanName} (${clanTag})`,
                    value: clanTag,
                });

                // Stringify the array and write it back to the JSON file
                fs.writeFileSync(filePath, JSON.stringify(choices, null, 2));
            }

            reloadAutocomplete();
        } catch (err) {
            await interaction.reply({
                content: `Could not get any clan data for ${clanTag}. Please check the clan tag and try again.`,
                ephemeral: true,
            });
        }

        const existingClan = await prisma.clan.findFirst({
            where: {
                tag: clanTag,
                guildID: interaction.guildId,
            },
        });

        if (existingClan) {
            await prisma.clan.update({
                where: {
                    id: existingClan.id,
                    guildID: interaction.guildId,
                },
                data: {
                    maxCapitalPeak: capitalPeak,
                    maxBarbarianCamp: barbarianCamp,
                    maxWizardValley: wizardValley,
                    maxBalloonLagoon: balloonLagoon,
                    maxBuildersWorkshop: buildersWorkshop,
                    maxDragonCliffs: dragonCliffs,
                    maxGolemQuarry: golemQuarry,
                    maxSkeletonPark: skeletonPark,
                    maxGoblinMines: goblinMines,
                },
            });

            await interaction.reply(`Clan ${clanTag} has been updated!`);
        } else {
            await prisma.clan.create({
                data: {
                    tag: clanTag,
                    guildID: interaction.guildId,
                    maxCapitalPeak: capitalPeak,
                    maxBarbarianCamp: barbarianCamp,
                    maxWizardValley: wizardValley,
                    maxBalloonLagoon: balloonLagoon,
                    maxBuildersWorkshop: buildersWorkshop,
                    maxDragonCliffs: dragonCliffs,
                    maxGolemQuarry: golemQuarry,
                    maxSkeletonPark: skeletonPark,
                    maxGoblinMines: goblinMines,
                },
            });

            await interaction.reply(
                `Clan setup for ${clanTag} has been completed!`
            );
        }
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content:
                "An internal error occured. Please contact EinEisbär | Felix",
            ephemeral: true,
        });
    }
}
