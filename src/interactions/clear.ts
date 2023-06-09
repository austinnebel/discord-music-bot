import { ChatInputCommandInteraction } from "discord.js";
import { Player } from "discord-player";
import { getGuildQueue } from "../utils/general";

/**
 * Handles the /clear chat command.
 */
export async function clear(
    interaction: ChatInputCommandInteraction,
    player: Player
) {
    // let's defer the interaction as things can take time to process
    await interaction.deferReply({ ephemeral: true });

    const queue = getGuildQueue(player, interaction);

    queue.clear();

    return void interaction.editReply(`Queue cleared.`);
}
