import "dotenv/config";
import fetch, { RequestInit } from "node-fetch";
import { verifyKey } from "discord-interactions";
import { Request, Response } from "express";
import {
    APIApplicationCommand,
    RESTGetAPIApplicationGuildCommandsResult,
} from "discord-api-types/v10";

/**
 * Fetches all app commands in `guild`.
 *
 * @param appId ID of the discord application.
 * @param guildID ID of the guild to check for the presence of `command`.
 */
async function getGuildCommands(appId: string, guildId: string) {
    const endpoint = `applications/${appId}/guilds/${guildId}/commands`;

    const res = await DiscordRequest(endpoint, { method: "GET" });
    const data = (await res.json()) as RESTGetAPIApplicationGuildCommandsResult;

    if (!data) {
        throw new Error("Failed to fetch guild commands.");
    }

    return data;
}

/**
 * Installs all specified commands into `guild`.
 *
 * @param appId ID of the discord application.
 * @param guildID ID of the guild to check for the presence of `command`.
 * @param commands The commands to install.
 */
export async function InstallGuildCommands(
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
            InstallGuildCommand(appId, guildId, c);
        } else {
            console.log(`"${c.name}" command already installed`);
        }
    }
}

/**
 * Updates all specified commands into `guild`.
 *
 * @param appId ID of the discord application.
 * @param guildID ID of the guild to check for the presence of `command`.
 * @param commands The commands to install.
 */
export async function UpdateGuildCommands(
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
            InstallGuildCommand(appId, guildId, c);
        }
    }
}

/**
 * Installs a command into the bot.
 *
 * @param appId ID of the discord application.
 * @param guildID ID of the guild to install `command` into.
 * @param command The command to install.
 */
export async function InstallGuildCommand(
    appId: string,
    guildId: string,
    command: Partial<APIApplicationCommand>
) {
    // API endpoint to get and post guild commands
    const endpoint = `applications/${appId}/guilds/${guildId}/commands`;
    // install command
    try {
        await DiscordRequest(endpoint, {
            method: "POST",
            body: JSON.stringify(command),
        });
    } catch (err) {
        console.error(err);
    }
}

/**
 * Makes a request to the Discord v10 API.
 *
 * @param endpoint Endpoint to make the request to.
 */
export async function DiscordRequest(endpoint: string, options: RequestInit) {
    // append endpoint to root API URL
    const url = "https://discord.com/api/v10/" + endpoint;

    // Use node-fetch to make requests
    const res = await fetch(url, {
        headers: {
            Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
            "Content-Type": "application/json; charset=UTF-8",
            "User-Agent":
                "DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)",
        },
        ...options,
    });

    // throw API errors
    if (!res.ok) {
        const data = await res.json();
        console.log(res.status);
        throw new Error(JSON.stringify(data));
    }

    // return original response
    return res;
}

/**
 * Verifies all incoming requests. This is used in the express application.
 *
 * @example
 * app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));
 */
export function VerifyDiscordRequest(
    clientKey: string
): (req: Request, res: Response, buf: Buffer, encoding: string) => void {
    return function (req, res, buf, encoding) {
        const signature = req.get("X-Signature-Ed25519");
        const timestamp = req.get("X-Signature-Timestamp");

        const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
        if (!isValidRequest) {
            res.status(401).send("Bad request signature");
            throw new Error("Bad request signature");
        }
    };
}
