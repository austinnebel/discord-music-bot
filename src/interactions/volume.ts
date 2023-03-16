import { ChatInputCommandInteraction } from "discord.js";
import { Player } from "discord-player";
import { getGuildQueue } from "../utils";

/**
 * Handles the /volume chat command.
 */
export async function volume(
    interaction: ChatInputCommandInteraction,
    player: Player
) {
    await interaction.deferReply({ ephemeral: true });

    const queue = getGuildQueue(player, interaction);

    if (!queue || !queue.isPlaying()) {
        return void interaction.editReply({
            content: "❌ | No music is being played!",
        });
    }

    const vol = interaction.options.getInteger("percent", false);

    if (!vol)
        return void interaction.editReply({
            content: `Current volume is **${queue.node.volume}**%.`,
        });

    if (vol < 0 || vol > 100) {
        return void interaction.editReply({
            content: "❌ | Volume range must be 0-100",
        });
    }

    const success = queue.node.setVolume(vol);

    return void interaction.editReply({
        content: success
            ? `Volume set to **${vol}%**.`
            : "❌ | Something went wrong!",
    });
}
