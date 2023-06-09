import {
    SlashCommandBuilder,
    SlashCommandIntegerOption,
    SlashCommandStringOption,
} from "discord.js";

export const ping = new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!");

export const play = new SlashCommandBuilder()
    .setName("play")
    .setDescription("Play a track, or resume the current track.")
    .addStringOption(
        new SlashCommandStringOption()
            .setName("track")
            .setDescription(
                "Track name or URL. Leave empty to resume the current track."
            )
            .setRequired(false)
            .setAutocomplete(true)
    );

export const mix = new SlashCommandBuilder()
    .setName("mix")
    .setDescription(
        "Create a mix from either a specific track or the current track."
    )
    .addStringOption(
        new SlashCommandStringOption()
            .setName("track")
            .setDescription(
                "Track name or URL. Leave empty to create a mix from the current track."
            )
            .setRequired(false)
            .setAutocomplete(true)
    );
export const pause = new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pauses the current track.");

export const skip = new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the current track.");

export const skipTo = new SlashCommandBuilder()
    .setName("skip-to")
    .setDescription("Skips the the specified track in the queue.")
    .addIntegerOption(
        new SlashCommandIntegerOption()
            .setName("index")
            .setDescription(
                "The index of the track. Use /queue to see the index of each track."
            )
            .setRequired(true)
            .setAutocomplete(true)
    );

export const seek = new SlashCommandBuilder()
    .setName("seek")
    .setDescription("Seek to a position in the current track.")
    .addStringOption(
        new SlashCommandStringOption()
            .setName("position")
            .setDescription(
                "The track position to seek to, either in seconds, MM:SS, or HH:MM:SS format."
            )
            .setRequired(true)
    );

export const volume = new SlashCommandBuilder()
    .setName("volume")
    .setDescription("Sets or retrieves the current playback volume.")
    .addIntegerOption(
        new SlashCommandIntegerOption()
            .setName("percent")
            .setDescription("Playback volume, from 0 to 100.")
            .setRequired(false)
    );

export const clear = new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clears the queue.");

export const queue = new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Returns all tracks in the queue.")
    .addIntegerOption(
        new SlashCommandIntegerOption()
            .setName("page")
            .setDescription("Page in the queue to retreive.")
            .setRequired(false)
    );

export const shuffle = new SlashCommandBuilder()
    .setName("shuffle")
    .setDescription("Shuffles the current queue.");
