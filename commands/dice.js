const Joi = require('joi');
const diceSchema = Joi.number().integer().min(2)
const schema = Joi.alternatives().try(diceSchema, Joi.string().regex(/(\dd)\d*/));

module.exports = {
    name: 'dice',
    description: 'Roll dice!',
    execute(message, args) {
        let out = '';
        let seirika0v0 = message.client.emojis.cache.get('647072487397392385');
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
                let dices = [];
                if (input.length === 2) {
                    count = input[0];
                    type = input[1];
                } else type = input[0];
                if (count < 1 || count > 10 || diceSchema.validate(type).error) {
                    out = out.concat(seirika0v0, '\n');
                    return false;
                }
                for (let i = 0; i < count; i++) {
                    dices.push(getDiceString(type));
                }
                if (dices.length > 1) {
                    let sum = 0;
                    let preFix = '';
                    dices.forEach(num => {
                        sum += num;
                        out = out.concat(preFix, ' ', num);
                        preFix = ' +';
                    })
                    out = out.concat(' = ', sum);
                } else out = out.concat(dices[0]);
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
