import { Player, QueryType } from "discord-player";
import { AutocompleteInteraction } from "discord.js";

export async function playAutoComplete(
    player: Player,
    interaction: AutocompleteInteraction
) {
    const query = interaction.options.getString("track", true);
    const results = await player.search(query, {
        searchEngine: QueryType.YOUTUBE,
    });

    //Returns a list of songs with their title
    return interaction.respond(
        results.tracks.slice(0, 10).map((t) => ({
            name: t.title,
            value: t.url,
        }))
    );
}
