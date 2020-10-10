const Joi = require('joi');
const diceSchema = Joi.number().integer().min(2)
const schema = Joi.alternatives().try(diceSchema, Joi.string().regex(/(\d[dD])\d*/));

module.exports = {
    name: 'dice',
    aliases: ['d'],
    description: 'Roll dice!',
    guildOnly: false,
    args: false,
    usage: '<user> <role>',
    execute(message, args) {
        let out = '';
        let seirika0v0 = message.client.emojis.cache.get('647072487397392385').toString();
        console.log(seirika0v0.toString());
        if (args.length > 10) {
            out = out.concat(seirika0v0, '\n');
        } else {
            args.every(element => {
                if (schema.validate(element).error) {
                    out = out.concat(seirika0v0, '\n');
                    return false;
                }
                let input = element.toLowerCase().split('d');
                let count = 1;
                let type;
                if (input.length === 2) {
                    count = input[0];
                    type = input[1];
                } else type = input[0];
                if (count < 1 || count > 10 || diceSchema.validate(type).error) {
                    out = out.concat(seirika0v0, '\n');
                    return false;
                }
                let sum = 0;
                let result;
                for (let i = 0; i < count; i++) {
                    result = getDiceString(type)
                    sum += result;
                    out = out.concat(result, ' ');
                }
                if (count > 1) out = out.concat('(Total is : ', sum.toString(), ')\n');
                out = out.concat('\n');
                return true;
            })
        }
        message.channel.send(out).catch(console.error);
    },
};

function getDiceString(type) {
    let dice = getRandomInt(type);
    if (isNaN(dice) || type < 2) dice = 'O^O';
    return dice;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max)) + 1;
}
