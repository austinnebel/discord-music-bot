import { ChatInputCommandInteraction } from "discord.js";
import { Player } from "discord-player";
import { formattedTimeToSeconds, getGuildQueue } from "../utils/general";

/**
 * Handles the /seek chat command.
 */
export async function seek(
    interaction: ChatInputCommandInteraction,
    player: Player
) {
    await interaction.deferReply({ ephemeral: true });

    const queue = getGuildQueue(player, interaction);

    if (!queue.isPlaying())
        return void interaction.followUp({
            content: "❌ | No music is being played!",
        });

    const duration = formattedTimeToSeconds(queue.currentTrack.duration);

    // User's seek time
    const time = interaction.options.getString("position", true);

    // parse formatted time in seconds
    let seconds = 0;
    try {
        seconds = formattedTimeToSeconds(time);
    } catch (error) {
        return void interaction.editReply(
            `❌ | Failed to seek, received invalid time of **${time}**.`
        );
    }

    // if outside track duration
    if (seconds < 0 || seconds > duration) {
        return void interaction.editReply(
            `❌ | Failed to seek to **${time}**. Track length is **${queue.currentTrack.duration}**.`
        );
    }

    await queue.node.seek(seconds * 1000);

    return void interaction.editReply({
        content: `Seeked to **${time}**.`,
    });
}
