import { ChatInputCommandInteraction } from "discord.js";
import { Player } from "discord-player";

/**
 * Handles the /clear chat command.
 */
export async function clear(
    interaction: ChatInputCommandInteraction,
    player: Player
) {
    // let's defer the interaction as things can take time to process
    await interaction.deferReply({ ephemeral: true });

    const queue = player.queues.get(interaction.guildId);

    const success = player.queues.delete(queue);

    return void interaction.editReply({
        content: success ? `Queue cleared.` : "❌ | Something went wrong!",
    });
}
