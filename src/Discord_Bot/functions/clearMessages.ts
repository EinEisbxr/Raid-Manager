import { Client, TextChannel } from "discord.js";

export async function clearMessages(client: Client, channelId: string) {
    const channel = client.channels.cache.get(channelId) as TextChannel;
    if (!channel) {
        console.log(`Channel with ID ${channelId} not found.`);
        return;
    }

    let fetched;
    do {
        fetched = await channel.messages.fetch({ limit: 100 });
        const notTooOld = fetched.filter(
            (message) =>
                Date.now() - message.createdTimestamp < 14 * 24 * 60 * 60 * 1000
        );
        const tooOld = fetched.filter(
            (message) =>
                Date.now() - message.createdTimestamp >=
                14 * 24 * 60 * 60 * 1000
        );

        const notFromRole = notTooOld.filter(
            (message) =>
                message.member &&
                !message.member.roles.cache.has("1234231847655968820")
        );
        const tooOldNotFromRole = tooOld.filter(
            (message) =>
                message.member &&
                !message.member.roles.cache.has("1234231847655968820")
        );

        if (notFromRole.size > 0) {
            await channel.bulkDelete(notFromRole);
        }

        for (let message of tooOldNotFromRole.values()) {
            await message.delete();
        }
    } while (fetched.size >= 2);
}
