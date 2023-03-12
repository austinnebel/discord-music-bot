import { APIApplicationCommand } from "discord-api-types/v10";
import { request } from "./request";

/**
 * Installs a command into the bot.
 *
 * @param appId ID of the discord application.
 * @param guildID ID of the guild to install `command` into.
 * @param command The command to install.
 */
export async function installGuildCommand(
    appId: string,
    guildId: string,
    command: Partial<APIApplicationCommand>
) {
    // API endpoint to get and post guild commands
    const endpoint = `applications/${appId}/guilds/${guildId}/commands`;
    // install command
    try {
        await request(endpoint, {
            method: "POST",
            body: JSON.stringify(command),
        });
    } catch (err) {
        console.error(err);
    }
}
