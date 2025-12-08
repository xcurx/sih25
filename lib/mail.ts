import { MailtrapClient } from "mailtrap"

export const client = new MailtrapClient({
    token: process.env.MAILTRAP_TOKEN || "",
    testInboxId: 4233755,
    sandbox: true,
})