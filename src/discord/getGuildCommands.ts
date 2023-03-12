import { RESTGetAPIApplicationGuildCommandsResult } from "discord-api-types/v10";
import { request } from "./request";

/**
 * Fetches all app commands in `guild`.
 *
 * @param appId ID of the discord application.
 * @param guildID ID of the guild to check for the presence of `command`.
 */
export async function getGuildCommands(appId: string, guildId: string) {
    const endpoint = `applications/${appId}/guilds/${guildId}/commands`;

    const res = await request(endpoint, { method: "GET" });
    const data = (await res.json()) as RESTGetAPIApplicationGuildCommandsResult;

    if (!data) {
        throw new Error("Failed to fetch guild commands.");
    }

    return data;
}
