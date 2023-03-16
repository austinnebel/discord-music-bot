import { RawTrackData, Player, Track } from "discord-player";
import getYoutubeMix from "yt-mix-playlist";

/**
 * The mix result returned from `getYoutubeMix`.
 */
type YoutubeMixResult = {
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
    items: (YoutubeMixItem & RawTrackData)[];
};

/**
 * Contains data on a track returned from `getYoutubeMix`.
 */
type YoutubeMixItem = {
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

/**
 * Contains the result of `getMix()`. This contains
 * the title of the mix along with all tracks in the mix.
 */
type MixResult = {
    title: string;
    tracks: Track[];
};

/**
 * Converts a `YoutubeMixItem` created by `getYoutubeMix` to a discord-player
 * `Track`.
 */
function convertToTrack(player: Player, vid: YoutubeMixItem): Track {
    const trackData: RawTrackData = {
        ...vid,
        description: "",
        views: 0,
        thumbnail: vid.thumbnails[0].url,
        author: vid.author.name,
    };
    return new Track(player, trackData);
}

/**
 * Creates a youtube mix from the provided track.
 */
export async function getMix(player: Player, track: Track): Promise<MixResult> {
    const mix: YoutubeMixResult = (await getYoutubeMix(
        // @ts-ignore
        track.raw.id
    )) as YoutubeMixResult;
    return {
        title: mix.title,
        tracks: mix.items.map((elem) => convertToTrack(player, elem)),
    };
}
