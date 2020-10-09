const fs = require('fs');
const Discord = require('discord.js');
require('dotenv').config()

const client = new Discord.Client();
client.commands = new Discord.Collection();
const prefix = '04';

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
    if (!(message.content.startsWith(prefix)) || message.author.bot) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;

    try {
        client.commands.get(command).execute(message, args, client);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!').catch(console.error);
    }
});

client.login(process.env.DISCORD_BOT_TOKEN).then(() => {
    console.log(`Discord bot Rinze Started!`);
})
    .catch(() => {
        console.log(`Unavailable to start bot, check your DISCORD_BOT_TOKEN`);
        process.exit(1);
    });
