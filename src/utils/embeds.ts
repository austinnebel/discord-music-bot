import { GuildQueue, Track } from "discord-player";
import { EmbedBuilder } from "discord.js";

/**
 * Creates a discord embed message that displays all songs in the current queue
 * along with the currently playing track if available.
 */
export function createQueueEmbed(
    title: string,
    queue: GuildQueue,
    tracks: Track[]
) {
    const trackList = tracks.map((t, i) => {
        return `${i + 1}. **${t.title}** ([link](<${t.url}>))`;
    });

    const description = `${trackList.join("\n")}`;

    const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setThumbnail(tracks[0].thumbnail)
        .setColor(0xff0000);

    if (queue.currentTrack) {
        embed.addFields([
            {
                name: "Now Playing",
                value: `🎶 | **${queue.currentTrack.title}** ([link](<${queue.currentTrack.url}>))`,
            },
        ]);
    }

    return embed;
}

/**
 * Creates a discord embed message that displays a track.
 */
export function createTrackEmbed(track: Track, title: string) {
    let embed = new EmbedBuilder();

    return embed
        .setTitle(title)
        .setDescription(`**[${track.title}](<${track.url}>)**`)
        .setThumbnail(track.thumbnail)
        .setFooter({ text: `${track.author} | ${track.duration}` })
        .setColor(0xff0000);
}
