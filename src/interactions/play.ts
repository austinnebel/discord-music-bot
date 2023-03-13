import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    GuildMember,
} from "discord.js";
import { Player } from "discord-player";
import { createTrackEmbed } from "../utils";

/**
 * Handles the /play chat command.
 */
export async function play(
    interaction: ChatInputCommandInteraction,
    player: Player
) {
    const member = interaction.member as GuildMember;
    const voiceChannel = member.voice.channel;
    const queue = player.queues.get(interaction.guildId);

    // User's song choice
    const trackQuery = interaction.options.getString("track", false);

    // let's defer the interaction as things can take time to process
    await interaction.deferReply({ ephemeral: true });

    if (!voiceChannel) {
        return void interaction.editReply(
            "❌ | You need to be in a Voice Channel to use this command!"
        );
    }

    // functionality when no query specified
    if (!trackQuery) {
        // resume currnet track if exists
        if (queue && queue.currentTrack) {
            const resumed = queue.node.resume();
            return void interaction.editReply({
                content: resumed
                    ? `Resuming **[${queue.currentTrack.title}](${queue.currentTrack.url})**`
                    : "❌ | Something went wrong!",
            });
            // return error
        } else {
            return void interaction.editReply(
                `❌ | You must specify a song name.`
            );
        }
    }

    try {
        const { track } = await player.play(voiceChannel, trackQuery, {
            nodeOptions: {
                volume: 50,
                // nodeOptions are the options for guild node (aka your queue in simple word)
                metadata: interaction, // we can access this metadata object using queue.metadata later on
            },
        });
        return void interaction.editReply(
            `Added **[${track.title}](<${track.url}>)** to the queue.`
        );
    } catch (e) {
        // let's return error if something failed
        return void interaction.editReply(`❌ | Something went wrong: ${e}`);
    }
}
