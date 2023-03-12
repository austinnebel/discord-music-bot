import { getRPSChoices } from "./game";
import { capitalize } from "./utils";
import {
    APIApplicationCommand,
    ApplicationCommandType,
} from "discord-api-types/v10";

// Simple test command
export const TEST_COMMAND: Partial<APIApplicationCommand> = {
    name: "test",
    description: "Tests the connection to the application.",
    type: ApplicationCommandType.ChatInput,
};

// Command containing options
export const CHALLENGE_COMMAND: Partial<APIApplicationCommand> = {
    name: "challenge",
    description: "Challenge to a match of rock paper scissors",
    options: [
        {
            type: 3,
            name: "object",
            description: "Pick your object",
            required: true,
            choices: createCommandChoices(),
        },
    ],
    type: ApplicationCommandType.ChatInput,
};

// Get the game choices from game
function createCommandChoices() {
    const choices = getRPSChoices();
    const commandChoices = [];

    for (let choice of choices) {
        commandChoices.push({
            name: capitalize(choice),
            value: choice.toLowerCase(),
        });
    }

    return commandChoices;
}
