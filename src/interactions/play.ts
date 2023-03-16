import { ChatInputCommandInteraction, GuildMember } from "discord.js";
import { Player } from "discord-player";
import { getGuildQueue } from "../utils";

/**
 * Handles the /play chat command.
 */
export async function play(
    interaction: ChatInputCommandInteraction,
    player: Player
) {
    const member = interaction.member as GuildMember;
    const voiceChannel = member.voice.channel;
    const queue = getGuildQueue(player, interaction);

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
        // resume current track if exists
        if (queue.currentTrack) {
            const resumed = queue.node.resume();
            return void interaction.editReply({
                content: resumed
                    ? `Resuming **[${queue.currentTrack.title}](<${queue.currentTrack.url}>)**`
                    : "❌ | Something went wrong!",
            });
            // play first track if queue has tracks
        } else if (!queue.isEmpty()) {
            queue.node.play(queue.tracks[0]);
            // return error
        } else {
            return void interaction.editReply(
                `❌ | You must specify a song name.`
            );
        }
    }

    try {
        const { track } = await player.play(voiceChannel, trackQuery);
        return void interaction.editReply(
            `Added **[${track.title}](<${track.url}>)** to the queue.`
        );
    } catch (e) {
        // let's return error if something failed
        return void interaction.editReply(`❌ | Something went wrong: ${e}`);
    }
}
