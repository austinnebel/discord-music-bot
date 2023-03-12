import { APIApplicationCommand } from "discord-api-types/v10";
import { getGuildCommands } from "./getGuildCommands";
import { installGuildCommand } from "./installGuildCommand";

/**
 * Updates all specified commands into `guild`.
 *
 * @param appId ID of the discord application.
 * @param guildID ID of the guild to check for the presence of `command`.
 * @param commands The commands to install.
 */
export async function updateGuildCommands(
    appId: string,
    guildId: string,
    commands: Partial<APIApplicationCommand>[]
) {
    if (guildId === "" || appId === "") return;

    const installedCommands = await getGuildCommands(appId, guildId);
    const installedCommandNames = installedCommands.map((c) => c.name);

    // updates each comand if installed
    for (const c of commands) {
        if (!installedCommandNames.includes(c.name)) {
            console.log(`"${c.name}" not installed, can't update.`);
        } else {
            console.log(`Updating "${c.name}"`);
            installGuildCommand(appId, guildId, c);
        }
    }
}
