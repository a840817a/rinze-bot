const dice = require('../helper/dice');

module.exports = {
    name: 'roll',
    aliases: ['roll', 'd', 'r'],
    description: 'Roll roll!',
    guildOnly: false,
    args: true,
    usage: '<dice>',
    execute(message, args) {
        let out = '';
        let serika0v0 = message.client.emojis.cache.get('647072487397392385').toString() || '0 ^ 0';
        if (args.length > 10) {
            out = out.concat(serika0v0, '\n');
        } else {
            console.log(args);
            args.forEach(element => {
                try {
                    out = out.concat(dice.roll(element), '\n');
                } catch (e) {
                    console.log(e);
                    out = out.concat(serika0v0, '\n');
                }
            })
        }
        message.channel.send(out).catch(console.error);
    },
};
