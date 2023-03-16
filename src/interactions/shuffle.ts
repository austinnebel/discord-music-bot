import { ChatInputCommandInteraction } from "discord.js";
import { Player, Track } from "discord-player";
import { createQueueEmbed } from "../utils/embeds";
import { shuffleTracks, getGuildQueue } from "../utils/general";

/**
 * Handles the /shuffle chat command.
 */
export async function shuffle(
    interaction: ChatInputCommandInteraction,
    player: Player
) {
    await interaction.deferReply({ ephemeral: true });

    const queue = getGuildQueue(player, interaction);
    if (!queue.isPlaying())
        return void interaction.followUp({
            content: "❌ | No music is being played!",
        });

    const shuffled = shuffleTracks(queue.tracks.toArray());
    queue.clear();
    queue.addTrack(shuffled);

    const embed = createQueueEmbed("Queue Shuffled", queue, shuffled);
    return void interaction.followUp({ embeds: [embed] });
}
