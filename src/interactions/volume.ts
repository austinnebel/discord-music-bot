import { ChatInputCommandInteraction } from "discord.js";
import { Player } from "discord-player";

/**
 * Handles the /volume chat command.
 */
export async function volume(
    interaction: ChatInputCommandInteraction,
    player: Player
) {
    await interaction.deferReply();
    const queue = player.queues.get(interaction.guildId);

    if (!queue || !queue.isPlaying()) {
        return void interaction.followUp({
            content: "❌ | No music is being played!",
        });
    }

    const vol = interaction.options.getInteger("volume", false);

    if (!vol)
        return void interaction.followUp({
            content: `🎧 | Current volume is **${queue.node.volume}**%!`,
        });

    if (vol < 0 || vol > 100) {
        return void interaction.followUp({
            content: "❌ | Volume range must be 0-100",
        });
    }

    const success = queue.node.setVolume(vol);

    return void interaction.followUp({
        content: success
            ? `✅ | Volume set to **${vol}%**!`
            : "❌ | Something went wrong!",
    });
}
