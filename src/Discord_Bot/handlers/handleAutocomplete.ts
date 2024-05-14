interface Choice {
    name: string;
    value: string;
}

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

let clanChoices: Choice[];
export function reloadAutocomplete() {
    try {
        const dirname = path.dirname(fileURLToPath(import.meta.url));
        const filePath = path.join(dirname, "../../../data/clanChoices.json");
        clanChoices = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    } catch (err) {
        console.error(err);
        clanChoices = [];
    }
}

export async function handleAutocomplete(interaction: any) {
    if (
        interaction.commandName === "get_raid_fails" ||
        interaction.commandName === "setup_clan"
    ) {
        const focusedValue = interaction.options.getFocused();
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
    }
}

reloadAutocomplete();
