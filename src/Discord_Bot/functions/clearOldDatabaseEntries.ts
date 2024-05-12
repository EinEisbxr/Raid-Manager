import { prisma } from "../../index.js";

export async function clearOldDatabaseEntries() {
    const date = new Date();
    date.setDate(date.getDate() - 1);

    await prisma.raid.deleteMany({
        where: {
            date: {
                lt: date,
            },
        },
    });
}
