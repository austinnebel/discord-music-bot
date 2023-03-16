import { ChatInputCommandInteraction, GuildMember } from "discord.js";
import { Player } from "discord-player";
import { getGuildQueue } from "../utils/general";
import { getMix } from "../utils/mixes";
import { createQueueEmbed } from "../utils/embeds";

/**
 * Handles the /mix chat command.
 */
export async function mix(
    interaction: ChatInputCommandInteraction,
    player: Player
) {
    await interaction.deferReply({ ephemeral: true });

    const member = interaction.member as GuildMember;
    const voiceChannel = member.voice.channel;
    const queue = getGuildQueue(player, interaction);

    // User's song choice
    const trackQuery = interaction.options.getString("track", false);

    if (!voiceChannel) {
        return void interaction.editReply(
            "❌ | You need to be in a Voice Channel to use this command!"
        );
    }

    // functionality when no query specified
    if (!trackQuery) {
        if (!queue.currentTrack) {
            return void interaction.editReply(
                `❌ | You must specify a song name.`
            );
        }
    }

    try {
        const mixBase = trackQuery ? trackQuery : queue.currentTrack;
        const results = await player.search(mixBase);

        if (results.isEmpty()) {
            return void interaction.editReply(`Failed to find results.`);
        }
        const mix = await getMix(player, results.tracks[0]);
        queue.addTrack(mix.tracks);

        // create message embed for the queue
        const embed = createQueueEmbed(mix.title, queue, mix.tracks);
        await interaction.followUp({ embeds: [embed] });

        if (!queue.isEmpty()) {
            if (!queue.channel) await queue.connect(voiceChannel);
            if (!queue.isPlaying()) await queue.node.play();
        }
        await interaction.editReply(
            `Added mix of **${mix.tracks.length} tracks** to the queue.`
        );
    } catch (e) {
        // let's return error if something failed
        return void interaction.editReply(`❌ | Something went wrong: ${e}`);
    }
}
