import "dotenv/config";
import {
    REST,
    Routes,
    Client,
    GatewayIntentBits,
    ActivityType,
    Interaction,
    ChatInputCommandInteraction,
} from "discord.js";
import { Player } from "discord-player";
import * as commands from "./commands";
import { play } from "./interactions/play";
import { skip } from "./interactions/skip";
import { pause } from "./interactions/pause";
import { seek } from "./interactions/seek";
import { volume } from "./interactions/volume";
import { createTrackEmbed } from "./utils";
import { queue } from "./interactions/queue";

// Application ID
const app_id = process.env.APP_ID;

// Guild/Server ID
const guild_id = process.env.GUILD_ID;

// Bot token
const token = process.env.DISCORD_TOKEN;

// Create rest endpoint for the bot at API version 10
const rest = new REST({ version: "10" }).setToken(token);

(async () => {
    try {
        console.log("Started refreshing application guild (/) commands.");

        await rest.put(Routes.applicationGuildCommands(app_id, guild_id), {
            body: Object.values(commands),
        });

        console.log("Successfully reloaded application guild (/) commands.");
    } catch (error) {
        console.error(error);
    }
})();

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

const player = new Player(client);

//////////////// Player Events ////////////////////

// called when a song it skipped
player.events.on("playerSkip", (queue, track) => {
    const interaction = queue.metadata as ChatInputCommandInteraction;
    console.log(interaction.commandName);
    // @ts-ignore
    return void queue.metadata.followUp(
        `Skipped to **${queue.node.playbackTime}**.`
    );
});

// called when a track is added to the queue
player.events.on("audioTrackAdd", (queue, track) => {
    // if this is the first song in the queue, don't show anything since it will
    // immediately trigger the 'playerStart' event instead
    if (!queue.currentTrack) {
        return;
    }

    // queue.metadata object is defined in /play when creating the queue
    const interaction = queue.metadata as ChatInputCommandInteraction;
    const embed = createTrackEmbed(track, "Added to Queue");
    interaction.channel.send({ embeds: [embed] });
});

// called when a track beings playing
player.events.on("playerStart", (queue, track) => {
    client.user.setPresence({
        status: "online",
        activities: [{ type: ActivityType.Listening, name: track.title }],
    });

    // queue.metadata object is defined in /play when creating the queue
    const interaction = queue.metadata as ChatInputCommandInteraction;
    const embed = createTrackEmbed(track, "Now Playing");
    interaction.channel.send({ embeds: [embed] });
});

// called when queue is empty
player.events.on("emptyQueue", () => {
    client.user.setStatus("idle");
    client.user.setActivity(null);
});

//////////////// Client Events ////////////////////

client.on("ready", (client) => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setStatus("idle");
    client.user.setActivity(null);
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    console.log("Received interaction", interaction.commandName);

    switch (interaction.commandName) {
        case "play":
            return await play(interaction, player);
        case "skip":
            return await skip(interaction, player);
        case "pause":
            return await pause(interaction, player);
        case "seek":
            return await seek(interaction, player);
        case "volume":
            return await volume(interaction, player);
        case "queue":
            return await queue(interaction, player);
        case "ping":
            return void (await interaction.reply("Pong!"));
    }
});

client.login(token);
