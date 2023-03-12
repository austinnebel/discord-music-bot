import {
    APIApplicationCommandInteraction,
    APIMessageComponentInteraction,
    APIPingInteraction,
    InteractionType,
} from "discord-api-types/v10";
import { Request } from "express";

/**
 * Checks that `req` is a ping interaction.
 */
export function isPingInteraction(
    req: Request
): req is Request<{}, {}, APIPingInteraction> {
    return req.body.type === InteractionType.Ping;
}

/**
 * Checks that `req` is an application command interaction.
 */
export function isApplicationCommandInteraction(
    req: Request
): req is Request<{}, {}, APIApplicationCommandInteraction> {
    return req.body.type === InteractionType.ApplicationCommand;
}

/**
 * Checks that `req` is a message component interaction.
 */
export function isMessageComponentInteraction(
    req: Request
): req is Request<{}, {}, APIMessageComponentInteraction> {
    return req.body.type === InteractionType.MessageComponent;
}
