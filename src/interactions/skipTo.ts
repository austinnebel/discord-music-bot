import { ChatInputCommandInteraction } from "discord.js";
import { Player } from "discord-player";
import { getGuildQueue } from "../utils/general";

/**
 * Handles the /skipTo chat command.
 */
export async function skipTo(
    interaction: ChatInputCommandInteraction,
    player: Player
) {
    await interaction.deferReply({ ephemeral: true });

    const queue = getGuildQueue(player, interaction);

    const trackIndex = interaction.options.getInteger("index", true) - 1;

    if (trackIndex < 0 || trackIndex > queue.getSize()) {
        return void interaction.editReply(
            `❌ | Invalid index provided. Must be between 1 and ${queue.getSize()}.`
        );
    }
    const track = queue.tracks.at(trackIndex);
    const success = queue.node.skipTo(track);

    return void interaction.editReply({
        content: success
            ? `Skipped to **[${track.title}](<${track.url}>)**.`
            : "❌ | Something went wrong!",
    });
}
