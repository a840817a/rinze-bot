const {InteractionResponseType} = require('discord-interactions');

const dice = require('../helper/dice');
const {CommandOptionType} = require("../helper/discord");

module.exports = {
    metadata: {
        name: 'roll',
        description: 'Roll dice!',
        options: [
            {
                name: 'dice',
                description: 'Dice',
                type: CommandOptionType.STRING,
                required: true
            }
        ]
    },
    execute(request, response) {
        let out = '';
        let serika0v0 = '0 ^ 0';
        let args = request.body.data.options.find((option) => option.name === 'dice').value.split(/ +/);

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

        response.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: out,
            },
        });
    }
}
