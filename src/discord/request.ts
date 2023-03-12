import "dotenv/config";
import fetch, { RequestInit } from "node-fetch";

/**
 * Makes a request to the Discord v10 API.
 *
 * @param endpoint Endpoint to make the request to.
 */
export async function request(endpoint: string, options: RequestInit) {
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
