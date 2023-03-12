import {
    APIApplicationCommandInteraction,
    APIInteraction,
    APIInteractionResponse,
    APIMessageComponentInteraction,
    APIPingInteraction,
    ButtonStyle,
    ComponentType,
    InteractionResponseType,
    InteractionType,
    MessageFlags,
} from "discord-api-types/v10";
import { Request, Response } from "express";
import { DiscordRequest } from "./api";
import { getResult, getShuffledOptions } from "./game";
import { getRandomEmoji } from "./utils";

// Store for in-progress games. In production, you'd want to use a DB
const activeGames = {};

type PingRequest = Request<{}, {}, APIPingInteraction>;
type ApplicationCommandRequest = Request<
    {},
    {},
    APIApplicationCommandInteraction
>;
type MessageComponentRequest = Request<{}, {}, APIMessageComponentInteraction>;

function isPingRequest(req: Request): req is PingRequest {
    return req.body.type === InteractionType.Ping;
}
function isApplicationCommandRequest(
    req: Request
): req is ApplicationCommandRequest {
    return req.body.type === InteractionType.ApplicationCommand;
}
function isMessageComponentRequest(
    req: Request
): req is MessageComponentRequest {
    return req.body.type === InteractionType.MessageComponent;
}

/**
 * Handles a request received on the `/interaction` endpoint.
 */
export async function handleInteraction(
    req: Request<{}, {}, APIInteraction>,
    res: Response
) {
    /**
     * Handle verification requests
     */
    if (isPingRequest(req)) return handlePingInteraction(res);

    /**
     * Handle slash command requests
     * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
     */
    if (isApplicationCommandRequest(req))
        return handleApplicationCommandInteraction(req, res);

    /**
     * Handle requests from interactive components
     * See https://discord.com/developers/docs/interactions/message-components#responding-to-a-component-interaction
     */
    if (isMessageComponentRequest(req))
        return handleMessageComponentInteraction(req, res);
}

/**
 * Handles a ping interaction.
 */
function handlePingInteraction(res: Response) {
    return res.send({ type: InteractionResponseType.Pong });
}

function handleTestCommand(req: Request, res: Response) {
    // Send a message into the channel where command was triggered from
    return res.send({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
            // Fetches a random emoji to send from a helper function
            content: "hello " + getRandomEmoji(),
        },
    });
}

function handleChallengeCommand(
    req: ApplicationCommandRequest,
    res: Response<APIInteractionResponse>
) {
    const { id, data, member } = req.body;

    const userId = member.user.id;

    // User's object choice
    // @ts-ignore
    const objectName = data.options[0].value;

    // Create active game using message ID as the game ID
    activeGames[id] = {
        id: userId,
        objectName,
    };

    return res.send({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
            // Fetches a random emoji to send from a helper function
            content: `Rock papers scissors challenge from <@${userId}>`,
            components: [
                {
                    type: ComponentType.ActionRow,
                    components: [
                        {
                            type: ComponentType.Button,
                            // Append the game ID to use later on
                            custom_id: `accept_button_${req.body.id}`,
                            label: "Accept",
                            style: ButtonStyle.Primary,
                        },
                    ],
                },
            ],
        },
    });
}
/**
 * Handles an application (slash) command.
 */
function handleApplicationCommandInteraction(
    req: ApplicationCommandRequest,
    res: Response<APIInteractionResponse>
) {
    const { id, data } = req.body;

    // "test" guild command
    if (data.name === "test") {
        return handleTestCommand(req, res);
    }
    // "challenge" guild command
    if (data.name === "challenge" && id) {
        return handleChallengeCommand(req, res);
    }
}

async function handleAcceptChallenge(
    req: MessageComponentRequest,
    res: Response<APIInteractionResponse>
) {
    const { data } = req.body;

    // custom_id set in payload when sending message component
    const componentId = data.custom_id;

    // get the associated game ID
    const gameId = componentId.replace("accept_button_", "");
    // Delete message with token in request body
    const endpoint = `webhooks/${process.env.APP_ID}/${req.body.token}/messages/${req.body.message.id}`;
    try {
        await res.send({
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
        await DiscordRequest(endpoint, { method: "DELETE" });
    } catch (err) {
        console.error("Error sending message:", err);
    }
}

async function handleSelectChoice(
    req: MessageComponentRequest,
    res: Response<APIInteractionResponse>
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
            await res.send({
                type: InteractionResponseType.ChannelMessageWithSource,
                data: { content: resultStr },
            });
            // Update ephemeral message
            await DiscordRequest(endpoint, {
                method: "PATCH",
                body: JSON.stringify({
                    content: "Nice choice " + getRandomEmoji(),
                    components: [],
                }),
            });
        } catch (err) {
            console.error("Error sending message:", err);
        }
    }
}
/**
 * Handles a message interaction.
 */
async function handleMessageComponentInteraction(
    req: MessageComponentRequest,
    res: Response<APIInteractionResponse>
) {
    const { data } = req.body;

    // custom_id set in payload when sending message component
    const componentId = data.custom_id;

    if (componentId.startsWith("accept_button_")) {
        return await handleAcceptChallenge(req, res);
    } else if (componentId.startsWith("select_choice_")) {
        return await handleSelectChoice(req, res);
    }
}

function handleApplicationCommandAutoCompleteInteraction() {}
function handleModalSubmitInteraction() {}
