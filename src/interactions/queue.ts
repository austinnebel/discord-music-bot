import { ChatInputCommandInteraction } from "discord.js";
import { Player } from "discord-player";
import { createQueueEmbed } from "../utils/embeds";
import { getGuildQueue } from "../utils/general";

/**
 * Handles the /queue chat command.
 */
export async function queue(
    interaction: ChatInputCommandInteraction,
    player: Player
) {
    await interaction.deferReply({ ephemeral: true });

    const queue = getGuildQueue(player, interaction);

    if (!queue.isPlaying()) {
        return void interaction.editReply({
            content: "❌ | No music is being played!",
        });
    }
    if (queue.isEmpty()) {
        return void interaction.editReply("❌ | Queue is empty.");
    }

    const embed = createQueueEmbed("Queue", queue, queue.tracks.toArray());
    return void interaction.editReply({
        embeds: [embed],
    });
}
