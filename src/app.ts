import "dotenv/config";
import express from "express";
import { CHALLENGE_COMMAND, TEST_COMMAND } from "./commands";
import {
    InstallGuildCommands,
    UpdateGuildCommands,
    VerifyDiscordRequest,
} from "./api";
import { handleInteraction } from "./interactions";

// Create an express app
const app = express();

// Get port, or default to 3000
const PORT = process.env.PORT || 3000;

// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post("/interactions", handleInteraction);

/** Listen for requests. */
app.listen(PORT, () => {
    console.log("Listening on port", PORT);

    // Check if guild commands from commands are installed (if not, install them)
    InstallGuildCommands(process.env.APP_ID, process.env.GUILD_ID, [
        TEST_COMMAND,
        CHALLENGE_COMMAND,
    ]);

    // Update commands
    UpdateGuildCommands(process.env.APP_ID, process.env.GUILD_ID, [
        TEST_COMMAND,
        CHALLENGE_COMMAND,
    ]);
});
