import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    GuildMember,
} from "discord.js";
import { Player } from "discord-player";
import { createMixEmbed, createTrackEmbed, getMix } from "../utils";

/**
 * Handles the /mix chat command.
 */
export async function mix(
    interaction: ChatInputCommandInteraction,
    player: Player
) {
    const member = interaction.member as GuildMember;
    const voiceChannel = member.voice.channel;
    const queue = player.queues.create(interaction.guildId, {
        volume: 50,
        // nodeOptions are the options for guild node (aka your queue in simple word)
        metadata: interaction, // we can access this metadata object using queue.metadata later on
    });

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

        if (!queue.isEmpty()) {
            if (!queue.channel) await queue.connect(voiceChannel);
            if (!queue.isPlaying()) await queue.node.play();
        }
        await interaction.editReply(
            `Added mix of **${mix.tracks.length} tracks** to the queue.`
        );

        const embed = createMixEmbed(mix.title, queue, mix.tracks);
        return void interaction.followUp({ embeds: [embed] });
    } catch (e) {
        // let's return error if something failed
        return void interaction.editReply(`❌ | Something went wrong: ${e}`);
    }
}
