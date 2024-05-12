import { prisma } from "../../index.js";

export async function handleButtons(interaction: any) {
    if (interaction.customId.startsWith("PB-")) {
        // Defer the interaction
        await interaction.deferUpdate();

        const databaseID = parseInt(interaction.customId.split("-")[2]);
        const pageButton = await prisma.PageButton.findUnique({
            where: {
                id: databaseID,
            },
        });

        const type = interaction.customId.split("-")[1];
        const pages = JSON.parse(pageButton.pages);

        let currentPage = pageButton.currentPage;
        if (type === "N" && currentPage < pages.length - 1) {
            currentPage = pageButton.currentPage + 1;
            interaction.editReply({
                content: `Showing raid fails for clan ${
                    pageButton.clanTag
                }; Page (${currentPage}/${pages.length - 1})`,
                embeds: pages[currentPage],
            });
        } else if (type === "P" && currentPage > 1) {
            currentPage = pageButton.currentPage - 1;
            interaction.editReply({
                content: `Showing raid fails for clan ${
                    pageButton.clanTag
                }; Page (${currentPage}/${pages.length - 1})`,
                embeds: pages[currentPage],
            });
        }
        await prisma.PageButton.update({
            where: {
                id: databaseID,
            },
            data: {
                currentPage: currentPage,
            },
        });
    }
}
