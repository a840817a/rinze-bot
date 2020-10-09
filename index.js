const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content.startsWith('04 D')) {
    var out = '';
    msg.content.substr(4).split("D").forEach(element => {
      var dice = getRandomInt(element);
      if (isNaN(dice) | msg.content.substr(4) < 2) dice = 'O^O';
      out = out.concat(dice, ' ');
    })
    msg.reply(out)
    .catch(console.error);
  }
});

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max)) + 1;
  }

client.login('NjU1MzM1ODYzMTEwMDc0MzY5.XfSnFQ.OI08EjygJx_FzSjr0_eTmiWdEHE');