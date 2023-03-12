import {
    APIInteractionResponse,
    APIMessageComponentInteraction,
    ComponentType,
    InteractionResponseType,
    MessageFlags,
} from "discord-api-types/v10";
import { Request, Response } from "express";
import discord from "../discord";
import { getShuffledOptions } from "../game";

export async function acceptChallenge(
    req: Request<{}, {}, APIMessageComponentInteraction>,
    res: Response<APIInteractionResponse>
): Promise<Response<APIInteractionResponse>> {
    const { data } = req.body;

    // custom_id set in payload when sending message component
    const componentId = data.custom_id;

    // get the associated game ID
    const gameId = componentId.replace("accept_button_", "");
    // Delete message with token in request body
    const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;
    try {
        const r = await res.send({
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                // Fetches a random emoji to send from a helper function
                content: "What is your object of choice?",
                // Indicates it'll be an ephemeral message
                flags: MessageFlags.Ephemeral,
                components: [
                    {
                        type: ComponentType.ActionRow,
                        components: [
                            {
                                type: ComponentType.StringSelect,
                                // Append game ID
                                custom_id: `select_choice_${gameId}`,
                                options: getShuffledOptions(),
                            },
                        ],
                    },
                ],
            },
        });
        // Delete previous message
        await discord.request(endpoint, { method: "DELETE" });
        return r;
    } catch (err) {
        console.error("Error sending message:", err);
    }
}
