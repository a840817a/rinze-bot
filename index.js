const Discord = require('discord.js');
require('dotenv').config()

const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.content.startsWith('04 D')) {
        let out = '';
        msg.content.substr(4).split("D").forEach(element => {
            let dice = getRandomInt(element);
            if (isNaN(dice) || msg.content.substr(4) < 2) dice = 'O^O';
            out = out.concat(dice, ' ');
        })
        msg.reply(out)
            .catch(console.error);
    }
});

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max)) + 1;
}

client.login(process.env.DISCORD_BOT_TOKEN).then(() => {
    console.log(`Discord bot Rinze Started!`);
})
    .catch(() => {
        console.log(`Unavailable to start bot, check your DISCORD_BOT_TOKEN`);
        process.exit(1);
    });
