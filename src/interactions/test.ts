import {
    APIInteractionResponse,
    InteractionResponseType,
} from "discord-api-types/v10";
import { getRandomEmoji } from "../utils";
import { Request, Response } from "express";

/**
 * Handles the /test chat command.
 */
export function test(
    req: Request,
    res: Response
): Response<APIInteractionResponse> {
    // Send a message into the channel where command was triggered from
    return res.send({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
            // Fetches a random emoji to send from a helper function
            content: "hello " + getRandomEmoji(),
        },
    });
}
