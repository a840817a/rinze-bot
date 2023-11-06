const fs = require('fs');
const express = require('express');
const {verifyKeyMiddleware, InteractionType, InteractionResponseType} = require('discord-interactions');
const axios = require("axios");
require('dotenv').config();

const app = express();

app.get('/', function (req, res) {
    res.send(':)')
})

app.post('/discordInteractions', verifyKeyMiddleware(process.env.DISCORD_BOT_PUBLIC_KEY), function (req, res) {
    const message = req.body;
    console.log(message);
    if (message.type === InteractionType.APPLICATION_COMMAND) {
        res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: 'Hello world',
            },
        });
    }
})

app.put('/discordAddSlashCommand', function (req, res) {
    axios.get()
})

const port = process.env.PORT || 3001;
app.listen(port);

////////////////////////
//  For OLD           //
////////////////////////

// const firebase = require('./helper/firebase');
//
// const client = new Client({
//     intents: [
//         GatewayIntentBits.Guilds,
//         GatewayIntentBits.GuildMessages,
//         GatewayIntentBits.DirectMessages,
//         GatewayIntentBits.MessageContent,
//     ]
// });
//
// client.commands = new Collection();
// const prefix = process.env.PREFIX || '04';
//
// const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
//
// for (const file of commandFiles) {
//     const command = require(`./commands/${file}`);
//     client.commands.set(command.name, command);
// }
//
// client.on(Events.ClientReady, () => {
//     firebase.init();
//     console.log(`Logged in as ${client.user.tag}!`);
// });
//
// client.on(Events.MessageCreate, message => {
//     if (message.author.bot) return;
//
//     let received = message.content;
//     if (message.content.startsWith(prefix)) {
//         received = received.slice(prefix.length).trim();
//     } else if (message.content.startsWith(`<@${client.user.id}>`)) {
//         received = received.slice(`<@${client.user.id}>`.length).trim();
//     } else return ;
//
//     const args = received.split(/ +/);
//     const commandName = args.shift().toLowerCase();
//
//     const command = client.commands.get(commandName)
//         || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
//     if (!command) return;
//
//     if (command.guildOnly && message.channel.type === 'dm') {
//         return message.reply('I can\'t execute that command inside DMs!');
//     }
//
//     if (command.args && !args.length) {
//         let reply = `You didn't provide any arguments, ${message.author}!`;
//
//         if (command.usage) {
//             reply += `\nThe proper usage would be: \`${prefix} ${command.name} ${command.usage}\``;
//         }
//
//         return message.channel.send(reply);
//     }
//
//     try {
//         command.execute(message, args);
//     } catch (error) {
//         console.error(error);
//         message.reply('there was an error trying to execute that command!').catch(console.error);
//     }
// });
//
// client.login(process.env.DISCORD_BOT_TOKEN).then(() => {
//     console.log(`Discord bot Rinze Started!`);
// })
//     .catch(() => {
//         console.log(`Unavailable to start bot, check your DISCORD_BOT_TOKEN`);
//         process.exit(1);
//     });
//
// ////////////////////////
// //  For Health Check  //
// ////////////////////////
//
// const http = require('http');
// const port = process.env.PORT || 3001;
//
// const server = http.createServer(function (req, res) {
//     res.writeHead(200,{'Content-Type':'text/plain'});
//     res.write('Rinze is good !!');
//     res.end();
// });
//
// server.listen(port);
