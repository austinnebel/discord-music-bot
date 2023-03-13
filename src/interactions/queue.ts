import { ChatInputCommandInteraction } from "discord.js";
import { Player } from "discord-player";

/**
 * Handles the /queue chat command.
 */
export async function queue(
    interaction: ChatInputCommandInteraction,
    player: Player
) {
    await interaction.deferReply({ ephemeral: true });

    const queue = player.queues.get(interaction.guildId);

    if (!queue || !queue.isPlaying())
        return void interaction.followUp({
            content: "❌ | No music is being played!",
        });

    const page = interaction.options.getInteger("page", false) ?? 1;

    const pageStart = 10 * (page - 1);
    const pageEnd = pageStart + 10;
    const currentTrack = queue.currentTrack;

    const tracks = queue.tracks
        .toArray()
        .slice(pageStart, pageEnd)
        .map((m, i) => {
            return `${i + pageStart + 1}. **${m.title}** ([link](${m.url}))`;
        });

    return void interaction.followUp({
        embeds: [
            {
                title: "Server Queue",
                description: `${tracks.join("\n")}${
                    queue.getSize() > pageEnd
                        ? `\n...${queue.getSize() - pageEnd} more track(s)`
                        : ""
                }`,
                color: 0xff0000,
                fields: [
                    {
                        name: "Now Playing",
                        value: `🎶 | **${currentTrack.title}** ([link](${currentTrack.url}))`,
                    },
                ],
            },
        ],
    });
}
