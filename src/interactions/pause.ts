import { ChatInputCommandInteraction } from "discord.js";
import { Player } from "discord-player";
import { getGuildQueue } from "../utils";

/**
 * Handles the /play chat command.
 */
export async function pause(
    interaction: ChatInputCommandInteraction,
    player: Player
) {
    await interaction.deferReply({ ephemeral: true });

    const queue = getGuildQueue(player, interaction);
    if (!queue.isPlaying())
        return void interaction.editReply({
            content: "❌ | No music is being played!",
        });

    const paused = queue.node.pause();

    return void interaction.editReply({
        content: paused ? "Paused." : "❌ | Something went wrong!",
    });
}
