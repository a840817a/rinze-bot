const axios = require("axios");

const discordBaseUrl = 'https://discord.com/api/v10'

module.exports = {
    ApplicationCommandType: {
        CHAT_INPUT: 1,
        USER: 2,
        MESSAGE: 3,
    },
    CommandOptionType: {
        SUB_COMMAND: 1,
        SUB_COMMAND_GROUP: 2,
        STRING: 3,
        INTEGER: 4,
        BOOLEAN: 5,
        USER: 6,
        CHANNEL: 7,
        ROLE: 8,
        MENTIONABLE: 9,
        NUMBER: 10,
        ATTACHMENT: 11,
    },
    async SetGlobalCommand(data) {
        try {
            let res = await axios.put(`${discordBaseUrl}/applications/${process.env.DISCORD_BOT_APPLICATION_ID}/commands`,
                JSON.stringify(data), {
                    headers: {
                        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
                        'Content-Type': 'application/json'
                    }
                });
            return res.data;
        } catch (e) {
            console.log(e);
        }
    },
    async editMessageByToken(interactionToken, data, ContentType = 'application/json', messageId = '@original') {
        let send;
        if (ContentType === 'application/json') {
            send = JSON.stringify(data);
        } else send = data
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
}
