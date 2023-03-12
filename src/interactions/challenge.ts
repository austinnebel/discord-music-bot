import {
    APIApplicationCommandInteraction,
    APIInteractionResponse,
    ButtonStyle,
    ComponentType,
    InteractionResponseType,
} from "discord-api-types/v10";
import { Request, Response } from "express";

/**
 * Handles the /challenge chat command.
 */
export function challenge(
    req: Request<{}, {}, APIApplicationCommandInteraction>,
    res: Response<APIInteractionResponse>,
    activeGames: object
): Response<APIInteractionResponse> {
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
