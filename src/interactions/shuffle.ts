import { ChatInputCommandInteraction } from "discord.js";
import { Player, Track } from "discord-player";
import { createQueueEmbed, getGuildQueue } from "../utils";

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

    const shuffled = shuffleList(queue.tracks.toArray());
    queue.clear();
    queue.addTrack(shuffled);

    const embed = createQueueEmbed("Queue Shuffled", queue, shuffled);
    return void interaction.followUp({ embeds: [embed] });
}

function shuffleList(array: Track[]) {
    let currentIndex = array.length,
        randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }

    return array;
}
