import { getGuildCommands } from "./getGuildCommands";
import { installGuildCommand } from "./installGuildCommand";
import { installGuildCommands } from "./installGuildCommands";
import { request } from "./request";
import { updateGuildCommands } from "./updateGuildCommands";
import { verifyRequest } from "./verifyRequest";

const discord = {
    getGuildCommands,
    installGuildCommand,
    installGuildCommands,
    request,
    updateGuildCommands,
    verifyRequest,
};

export default discord;
