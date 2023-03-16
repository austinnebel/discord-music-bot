import { Player, Track } from "discord-player";
import { GuildTextBasedChannel, Interaction } from "discord.js";

/**
 * Extra metadata that is stored in each `GuildQueue` object.
 */
export type QueueMetadata = {
    channel: GuildTextBasedChannel;
};

/**
 * Returns the queue for the guild that `interaction` originated from.
 *
 * If the queue does not exist, it is created.
 *
 * @param player The discord audio player object.
 * @param interaction The interaction that requested the queue.
 */
export function getGuildQueue(player: Player, interaction: Interaction) {
    return player.queues.create<QueueMetadata>(interaction.guildId, {
        volume: 5,
        // we can access this metadata object using queue.metadata later on
        metadata: {
            channel: interaction.channel,
        },
    });
}

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

export function shuffleTracks(array: Track[]) {
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
