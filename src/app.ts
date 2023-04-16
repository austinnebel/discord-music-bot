import "dotenv/config";
import {
    REST,
    Routes,
    Client,
    GatewayIntentBits,
    ActivityType,
    AutocompleteInteraction,
} from "discord.js";
import { GuildQueue, Player } from "discord-player";
import * as commands from "./commands";
import { play } from "./interactions/play";
import { skip } from "./interactions/skip";
import { pause } from "./interactions/pause";
import { seek } from "./interactions/seek";
import { volume } from "./interactions/volume";
import { queue } from "./interactions/queue";
import { mix } from "./interactions/mix";
import { clear } from "./interactions/clear";
import { skipTo } from "./interactions/skipTo";
import { shuffle } from "./interactions/shuffle";
import { createTrackEmbed } from "./utils/embeds";
import { QueueMetadata } from "./utils/general";
import { playAutoComplete } from "./autocomplete/play";
import { skipToAutoComplete } from "./autocomplete/skip-to";

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

// called when a track is added to the queue
player.events.on("audioTrackAdd", (queue: GuildQueue<QueueMetadata>, track) => {
    // if this is the first song in the queue, don't show anything since it will
    // immediately trigger the 'playerStart' event instead
    if (!queue.currentTrack) {
        return;
    }

    const embed = createTrackEmbed(track, "Added to Queue");
    queue.metadata.channel.send({ embeds: [embed] });
});

// called when a track beings playing
player.events.on("playerStart", (queue: GuildQueue<QueueMetadata>, track) => {
    client.user.setPresence({
        status: "online",
        activities: [{ type: ActivityType.Listening, name: track.title }],
    });

    const embed = createTrackEmbed(track, "Now Playing");
    queue.metadata.channel.send({ embeds: [embed] });
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
    if (interaction.isAutocomplete()) {
        switch (interaction.commandName) {
            case "play":
                return void (await playAutoComplete(player, interaction));
            case "mix":
                return void (await playAutoComplete(player, interaction));
            case "skip-to":
                return void (await skipToAutoComplete(player, interaction));
            default:
                return;
        }
    }

    if (interaction.isChatInputCommand()) {
        try {
            switch (interaction.commandName) {
                case "play":
                    return await play(interaction, player);
                case "mix":
                    return await mix(interaction, player);
                case "skip":
                    return await skip(interaction, player);
                case "pause":
                    return await pause(interaction, player);
                case "seek":
                    return await seek(interaction, player);
                case "skip-to":
                    return await skipTo(interaction, player);
                case "clear":
                    return await clear(interaction, player);
                case "shuffle":
                    return await shuffle(interaction, player);
                case "volume":
                    return await volume(interaction, player);
                case "queue":
                    return await queue(interaction, player);
                case "ping":
                    return void (await interaction.reply("Pong!"));
            }
        } catch (error) {
            interaction.reply("❌ | Oops! Something went wrong.");
        }
    }
});

client.login(token);
