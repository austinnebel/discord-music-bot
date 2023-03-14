import { GuildQueue, Player, RawTrackData, Track } from "discord-player";
import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import ytmpl from "yt-mix-playlist";

/**
 * Converts a string representing a time that is in one of the
 * following formats: HH:MM:SS, MM:SS, SS, into a number of seconds.
 */
export function formattedTimeToSeconds(time: string) {
    let seconds = 0;
    const splitTime = time.split(":");
    if (splitTime.length >= 1) {
        seconds += parseInt(splitTime[splitTime.length - 1]);
    }
    if (splitTime.length >= 2) {
        seconds += parseInt(splitTime[splitTime.length - 2]) * 60;
    }
    if (splitTime.length === 3) {
        seconds += parseInt(splitTime[splitTime.length - 3]) * 3600;
    }
    if (splitTime.length > 3) {
        throw new Error("Invalid time received.");
    }
    return seconds;
}

type YoutubeMix = {
    /** ID of the video used to create mix. */
    id: string;
    /** Mix Title. */
    title: string;
    /** Author ex. YouTube*/
    author: string;
    /** URL of track `ID`. */
    url: string;
    /** Current index in mix. */
    currentIndex: 0;
    /** All videos in this mix. */
    items: (YoutubeMixEntry & RawTrackData)[];
};

type YoutubeMixEntry = {
    /** ID of the video in the mix. */
    id: string;
    /** Video title. */
    title: string;
    /** Video author. */
    author: {
        name: string;
        channelId: string;
        url: string;
    };
    /** Video URL. */
    url: string;
    /** If true, this is the current item in the mix. */
    selected: true;
    /** Video length. */
    duration: string;
    /** Video thumbnails. */
    thumbnails: { url: string; width: number; height: number }[];
};

function convertToTrack(player: Player, vid: YoutubeMixEntry): Track {
    const trackData: RawTrackData = {
        ...vid,
        description: "",
        views: 0,
        thumbnail: vid.thumbnails[0].url,
        author: vid.author.name,
    };
    return new Track(player, trackData);
}

type MixResult = {
    title: string;
    tracks: Track[];
};
/**
 * Creates a youtube mix from the provided track.
 */
export async function getMix(player: Player, track: Track): Promise<MixResult> {
    // @ts-ignore
    const mix: YoutubeMix = (await ytmpl(track.raw.id)) as YoutubeMix;
    return {
        title: mix.title,
        tracks: mix.items.map((elem) => convertToTrack(player, elem)),
    };
}

export function createMixEmbed(
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

// Simple method that returns a random emoji from list
export function getRandomEmoji() {
    const emojiList = [
        "😭",
        "😄",
        "😌",
        "🤓",
        "😎",
        "😤",
        "🤖",
        "😶‍🌫️",
        "🌏",
        "📸",
        "💿",
        "👋",
        "🌊",
        "✨",
    ];
    return emojiList[Math.floor(Math.random() * emojiList.length)];
}

export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
