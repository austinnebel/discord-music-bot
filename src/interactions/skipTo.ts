import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    GuildMember,
} from "discord.js";
import { Player } from "discord-player";
import { createTrackEmbed, getMix } from "../utils";

/**
 * Handles the /skipTo chat command.
 */
export async function skipTo(
    interaction: ChatInputCommandInteraction,
    player: Player
) {
    await interaction.deferReply({ ephemeral: true });

    const queue = player.queues.create(interaction.guildId, {
        volume: 50,
        // nodeOptions are the options for guild node (aka your queue in simple word)
        metadata: interaction, // we can access this metadata object using queue.metadata later on
    });

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
