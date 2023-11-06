import axios from "axios";
import {ApplicationCommand} from "./structure/applicationCommand";

const discordBaseUrl = 'https://discord.com/api/v10'

export async function SetGlobalCommand(data: ApplicationCommand[]) {
    try {
        let res = await axios.put(`${discordBaseUrl}/applications/${process.env.DISCORD_BOT_APPLICATION_ID}/commands`,
            data, {
                headers: {
                    Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            });
        return res.data;
    } catch (e) {
        console.log(e);
    }
}

export async function editMessageByToken(interactionToken: string, data: any, ContentType = 'application/json', messageId = '@original') {
    try {
        let res = await axios.patch(`${discordBaseUrl}/webhooks/${process.env.DISCORD_BOT_APPLICATION_ID}/${interactionToken}/messages/${messageId}`,
            data, {
                headers: {
                    Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
                    'Content-Type': ContentType
                }
            });
        return res.data;
    } catch (e) {
        console.log(e);
    }
}
