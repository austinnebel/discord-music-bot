import { APIApplicationCommand } from "discord-api-types/v10";
import { getGuildCommands } from "./getGuildCommands";
import { installGuildCommand } from "./installGuildCommand";

/**
 * Installs all specified commands into `guild`.
 *
 * @param appId ID of the discord application.
 * @param guildID ID of the guild to check for the presence of `command`.
 * @param commands The commands to install.
 */
export async function installGuildCommands(
    appId: string,
    guildId: string,
    commands: Partial<APIApplicationCommand>[]
) {
    if (guildId === "" || appId === "") return;

    const installedCommands = await getGuildCommands(appId, guildId);
    const installedCommandNames = installedCommands.map((c) => c.name);

    for (const c of commands) {
        // install if not already installed
        if (!installedCommandNames.includes(c.name)) {
            console.log(`Installing "${c.name}"`);
            installGuildCommand(appId, guildId, c);
        } else {
            console.log(`"${c.name}" command already installed`);
        }
    }
}
