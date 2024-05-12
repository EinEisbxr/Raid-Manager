interface Choice {
    name: string;
    value: string;
}

export async function handleAutocomplete(interaction: any) {
    if (interaction.commandName === "setup_clan") {
        const choices = [
            {
                name: "Lost F2P 2 (#2LG222Q0L)",
                value: "#2LG222Q0L",
            },
        ];

        const focusedValue = interaction.options.getFocused();
        const filteredChoices = choices.filter((choice) =>
            choice.name.toLowerCase().includes(focusedValue.toLowerCase())
        );

        const results: Choice[] = filteredChoices.map((choice) => {
            return {
                name: choice.name,
                value: choice.value,
            };
        });

        interaction.respond(results.slice(0, 25));
    }
}
