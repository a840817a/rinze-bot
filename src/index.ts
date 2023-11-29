import fs from "fs";
import express from "express";
import path from "path";
import {verifyKeyMiddleware} from "discord-interactions";

import {init as initFirebase} from "./helper/firebase";
import {SetGlobalCommand} from "./helper/discord/functions";
import {ApplicationCommand} from "./helper/discord/structure/applicationCommand";
import {InteractionType} from "./helper/discord/structure/interaction";

require('dotenv').config();

const app = express();
const commandFiles = fs.readdirSync(path.join(__dirname, './commands')).filter(file => file.endsWith('.js'));

app.get('/', function (req, res) {
    res.send(':)')
})

app.post('/discordInteractions', verifyKeyMiddleware(process.env.DISCORD_BOT_PUBLIC_KEY ?? ''), function (req, res) {
    const message = req.body;
    console.log(message);
    if (message.type === InteractionType.APPLICATION_COMMAND) {
        if (commandFiles.includes(message.data.name + '.js')) {
            const {execute} = require(`./commands/${message.data.name}.js`);
            execute(req, res).then().catch((error: any) => console.log(error));
        }
    }
})

app.get('/discordSetCommand', function (req, res) {
    let commands: ApplicationCommand[] = [];
    for (const file of commandFiles) {
        const {metadata} = require(`./commands/${file}`);
        commands.push(metadata)
    }
    SetGlobalCommand(commands).catch(console.error);
    res.send(':D');
})

const port = process.env.PORT || 3001;
app.listen(port);

initFirebase();
