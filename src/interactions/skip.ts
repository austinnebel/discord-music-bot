import { ChatInputCommandInteraction } from "discord.js";
import { Player } from "discord-player";
import { getGuildQueue } from "../utils/general";

/**
 * Handles the /skip chat command.
 */
export async function skip(
    interaction: ChatInputCommandInteraction,
    player: Player
) {
    await interaction.deferReply({ ephemeral: true });

    const queue = getGuildQueue(player, interaction);
    if (!queue.currentTrack)
        return void interaction.editReply({
            content: "❌ | No music in queue!",
        });

    // save current track information for reply
    const currentTrackTitle = queue.currentTrack.title;
    const currentTrackURL = queue.currentTrack.url;

    // skip song
    const skipped = queue.node.skip();

    return void interaction.editReply({
        content: skipped
            ? `Skipped **[${currentTrackTitle}](<${currentTrackURL}>)**.`
            : "❌ | Something went wrong!",
    });
}
