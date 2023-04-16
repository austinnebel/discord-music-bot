import { Player } from "discord-player";
import { AutocompleteInteraction } from "discord.js";
import { getGuildQueue } from "../utils/general";

export async function skipToAutoComplete(
    player: Player,
    interaction: AutocompleteInteraction
) {
    const queue = getGuildQueue(player, interaction);

    //Returns a list of songs with their title
    return interaction.respond(
        queue.tracks.map((t, i) => ({
            name: `${i + 1}. ${t.title}`,
            value: i + 1,
        }))
    );
}
