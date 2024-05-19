interface Choice {
    name: string;
    value: string;
}

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

let clanChoices: Choice[];
let skillLevelChoices: Choice[];
export function reloadAutocomplete() {
    try {
        const dirname = path.dirname(fileURLToPath(import.meta.url));
        const filePathClanChoices = path.join(
            dirname,
            "../../../data/clanChoices.json"
        );
        clanChoices = JSON.parse(fs.readFileSync(filePathClanChoices, "utf-8"));

        const filePathSkillLevels = path.join(
            dirname,
            "../../../data/skillLevelChoices.json"
        );
        skillLevelChoices = JSON.parse(
            fs.readFileSync(filePathSkillLevels, "utf-8")
        );
    } catch (err) {
        console.error(err);
        clanChoices = [];
        skillLevelChoices = [];
    }
}

export async function handleAutocomplete(interaction: any) {
    const focusedOption = interaction.options.getFocused();

    if (focusedOption.name === "clan_tag") {
        const focusedValue = focusedOption.value;
        const filteredChoices = clanChoices.filter((choice: Choice) =>
            choice.name.toLowerCase().includes(focusedValue.toLowerCase())
        );

        const results: Choice[] = filteredChoices.map((choice: Choice) => {
            return {
                name: choice.name,
                value: choice.value,
            };
        });

        interaction.respond(results.slice(0, 25));
    } else if (focusedOption.name === "skill_level") {
        const focusedValue = focusedOption.value;
        const filteredChoices = skillLevelChoices.filter((choice: Choice) =>
            choice.name.toLowerCase().includes(focusedValue.toLowerCase())
        );

        const results: Choice[] = filteredChoices.map((choice: Choice) => {
            return {
                name: choice.name,
                value: choice.value,
            };
        });

        interaction.respond(results.slice(0, 25));
    }
}

reloadAutocomplete();
