import { Track } from "discord-player";
import { EmbedBuilder } from "discord.js";

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

/**
 * Creates a discord embed message that displays a track.
 */
export function createTrackEmbed(track: Track, title: string) {
    let embed = new EmbedBuilder();

    return embed
        .setTitle(title)
        .setDescription(`**[${track.title}](${track.url})**`)
        .setThumbnail(track.thumbnail)
        .setFooter({ text: `${track.author} | ${track.duration}` });
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
