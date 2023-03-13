import { ChatInputCommandInteraction } from "discord.js";
import { Player } from "discord-player";

/**
 * Handles the /play chat command.
 */
export async function pause(
    interaction: ChatInputCommandInteraction,
    player: Player
) {
    await interaction.deferReply();

    const queue = player.queues.get(interaction.guildId);
    if (!queue || !queue.isPlaying())
        return void interaction.followUp({
            content: "❌ | No music is being played!",
        });

    const paused = queue.node.pause();

    return void interaction.followUp({
        content: paused ? "⏸ | Paused!" : "❌ | Something went wrong!",
    });
}
