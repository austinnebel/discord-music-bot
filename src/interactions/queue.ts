import { ChatInputCommandInteraction } from "discord.js";
import { Player } from "discord-player";
import { createMixEmbed } from "../utils";

/**
 * Handles the /queue chat command.
 */
export async function queue(
    interaction: ChatInputCommandInteraction,
    player: Player
) {
    await interaction.deferReply({ ephemeral: true });

    const queue = player.queues.get(interaction.guildId);

    if (!queue || !queue.isPlaying()) {
        return void interaction.editReply({
            content: "❌ | No music is being played!",
        });
    }

    const embed = createMixEmbed("Queue", queue, queue.tracks.toArray());
    return void interaction.editReply({
        embeds: [embed],
    });
}
