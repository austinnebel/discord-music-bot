import {
    APIInteractionResponse,
    APIMessageComponentInteraction,
    InteractionResponseType,
} from "discord-api-types/v10";
import { Request, Response } from "express";
import discord from "../discord";
import { getResult } from "../game";
import { getRandomEmoji } from "../utils";

/**
 * Handles the selection of a choice from the dropdown menu.
 */
export async function select(
    req: Request<{}, {}, APIMessageComponentInteraction>,
    res: Response<APIInteractionResponse>,
    activeGames: object
) {
    const { data } = req.body;

    // custom_id set in payload when sending message component
    const componentId = data.custom_id;

    // get the associated game ID
    const gameId = componentId.replace("select_choice_", "");

    if (activeGames[gameId]) {
        // Get user ID and object choice for responding user
        const userId = req.body.member.user.id;

        // @ts-ignore
        const objectName = data.values[0];
        // Calculate result from helper function
        const resultStr = getResult(activeGames[gameId], {
            id: userId,
            objectName,
        });

        // Remove game from storage
        delete activeGames[gameId];

        // Update message with token in request body
        const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;

        try {
            // Send results
            const r = await res.send({
                type: InteractionResponseType.ChannelMessageWithSource,
                data: { content: resultStr },
            });
            // Update ephemeral message
            await discord.request(endpoint, {
                method: "PATCH",
                body: JSON.stringify({
                    content: "Nice choice " + getRandomEmoji(),
                    components: [],
                }),
            });

            return r;
        } catch (err) {
            console.error("Error sending message:", err);
        }
    }
}
