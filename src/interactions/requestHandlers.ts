import {
    APIApplicationCommandInteraction,
    APIInteraction,
    APIInteractionResponse,
    APIMessageComponentInteraction,
    InteractionResponseType,
} from "discord-api-types/v10";
import { Request, Response } from "express";
import { acceptChallenge } from "./acceptChallenge";
import { challenge } from "./challenge";
import { select } from "./select";
import { test } from "./test";
import {
    isApplicationCommandInteraction,
    isMessageComponentInteraction,
    isPingInteraction,
} from "./utils";

// Store for in-progress games. In production, you'd want to use a DB
const activeGames = {};

/**
 * Handles a request received on the `/interaction` endpoint.
 */
export async function handleInteraction(
    req: Request<{}, {}, APIInteraction>,
    res: Response
): Promise<Response> {
    /**
     * Handle verification requests
     */
    if (isPingInteraction(req)) return handlePingInteraction(res);

    /**
     * Handle slash command requests
     * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
     */
    if (isApplicationCommandInteraction(req))
        return handleApplicationCommandInteraction(req, res);

    /**
     * Handle requests from interactive components
     * See https://discord.com/developers/docs/interactions/message-components#responding-to-a-component-interaction
     */
    if (isMessageComponentInteraction(req))
        return handleMessageComponentInteraction(req, res);
}

/**
 * Handles a ping interaction.
 */
function handlePingInteraction(
    res: Response<APIInteractionResponse>
): Response<APIInteractionResponse> {
    return res.send({ type: InteractionResponseType.Pong });
}

/**
 * Handles a message interaction.
 */
async function handleMessageComponentInteraction(
    req: Request<{}, {}, APIMessageComponentInteraction>,
    res: Response<APIInteractionResponse>
): Promise<Response<APIInteractionResponse>> {
    const { data } = req.body;

    // custom_id set in payload when sending message component
    const componentId = data.custom_id;

    if (componentId.startsWith("accept_button_")) {
        return await acceptChallenge(req, res);
    } else if (componentId.startsWith("select_choice_")) {
        return await select(req, res, activeGames);
    } else {
        return res.sendStatus(404);
    }
}

/**
 * Handles an application (slash) command interaction.
 *
 * @param req The request made.
 * @param res The response object.
 */
function handleApplicationCommandInteraction(
    req: Request<{}, {}, APIApplicationCommandInteraction>,
    res: Response<APIInteractionResponse>
): Response<APIInteractionResponse> {
    const { id, data } = req.body;

    // "test" guild command
    if (data.name === "test") {
        return test(req, res);
    }
    // "challenge" guild command
    if (data.name === "challenge" && id) {
        return challenge(req, res, activeGames);
    }
}
