import { Request, Response } from "express";
import { verifyKey } from "discord-interactions";

/**
 * Verifies all incoming requests. This is used in the express application.
 *
 * @example
 * app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));
 */
export function verifyRequest(
    clientKey: string
): (req: Request, res: Response, buf: Buffer, encoding: string) => void {
    return function (req, res, buf, encoding) {
        const signature = req.get("X-Signature-Ed25519");
        const timestamp = req.get("X-Signature-Timestamp");

        const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
        if (!isValidRequest) {
            res.status(401).send("Bad request signature");
            throw new Error("Bad request signature");
        }
    };
}
