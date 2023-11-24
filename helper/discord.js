const axios = require("axios");

const discordBaseUrl = 'https://discord.com/api'
const discordApplicationId = process.env.DISCORD_BOT_APPLICATION_ID

export enum ApplicationCommandType {
    CHAT_INPUT = 1,
    USER = 2,
    MESSAGE = 3,
}

export enum CommandOptionType {
    SUB_COMMAND = 1,
    SUB_COMMAND_GROUP = 2,
    STRING = 3,
    INTEGER = 4,
    BOOLEAN = 5,
    USER = 6,
    CHANNEL = 7,
    ROLE = 8,
    MENTIONABLE = 9,
    NUMBER = 10,
    ATTACHMENT = 11,
}

export async function SetGlobalCommand(data) {
    let res = await axios.patch(discordBaseUrl + '/applications/' + applicationId + '/commands',
        JSON.stringify(data), {headers: {'Content-Type': 'application/json'}});
    return res.data;
}

export async function editMessageByToken(interactionToken, data, messageId = '@original') {
    let res = await axios.patch(discordBaseUrl + '/webhooks/' + discordApplicationId + '/' + interactionToken + '/messages/' + messageId,
        JSON.stringify(data), {headers: {'Content-Type': 'application/json'}});
    return res.data;
}
