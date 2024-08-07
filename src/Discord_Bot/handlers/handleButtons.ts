import { prisma } from '../../index.js';

export async function handleButtons(interaction: any) {
    if (interaction.customId.startsWith('PB-')) {
        // Defer the interaction
        await interaction.deferUpdate();

        const databaseID = parseInt(interaction.customId.split('-')[2]);
        const pageButton = await prisma.pageButton.findUnique({
            where: {
                id: databaseID,
            },
        });

        const type = interaction.customId.split('-')[1];
        const pages = pageButton ? JSON.parse(pageButton.pages) : [];

        let currentPage = pageButton ? pageButton.currentPage : 1;
        if (type === 'N' && currentPage < pages.length) {
            currentPage++;
            interaction.editReply({
                content: `Showing raid fails for clan ${pageButton?.clanTag}; Page (${currentPage}/${pages.length})`,
                embeds: pages[currentPage - 1],
            });
        } else if (type === 'P' && currentPage > 1) {
            currentPage--;
            interaction.editReply({
                content: `Showing raid fails for clan ${pageButton?.clanTag}; Page (${currentPage}/${pages.length})`,
                embeds: pages[currentPage - 1],
            });
        }
        await prisma.pageButton.update({
            where: {
                id: databaseID,
            },
            data: {
                currentPage: currentPage,
            },
        });
    }
}
