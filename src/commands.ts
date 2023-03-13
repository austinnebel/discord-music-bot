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
    );

export const pause = new SlashCommandBuilder()
    .setName("pause")
    .setDescription("Pauses the current track.");

export const skip = new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skips the current track.");

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
    .setDescription("Sets the volume of the current queue, from 0 to 100.");

export const queue = new SlashCommandBuilder()
    .setName("queue")
    .setDescription("Returns all tracks in the queue.")
    .addIntegerOption(
        new SlashCommandIntegerOption()
            .setName("page")
            .setDescription("Page in the queue to retreive.")
            .setRequired(false)
    );
