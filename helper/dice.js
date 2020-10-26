const Joi = require('joi');
const diceSchema = Joi.number().integer().min(2);
const schema = Joi.alternatives().try(diceSchema, Joi.string().regex(/(\d[dD])\d*/));

module.exports = {
    roll(dice) {
        let out = '';
        if (schema.validate(dice).error) throw new Error("Invalidate dice!");
        let input = dice.toLowerCase().split('d');
        let count = 1;
        let type;
        if (input.length === 2) {
            count = input[0];
            type = input[1];
        } else type = input[0];
        if (count < 1 || count > 10 || diceSchema.validate(type).error) throw new Error("Invalidate count!");
        let sum = 0;
        let result;
        for (let i = 0; i < count; i++) {
            result = getDiceString(type)
            sum += result;
            out = out.concat(result, ' ');
        }
        if (count > 1) out = out.concat('(Total is : ', sum.toString(), ')');
        return out;
    }
}

function getDiceString(type) {
    let dice = getRandomInt(type);
    if (isNaN(dice) || type < 2) dice = 'O^O';
    return dice;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max)) + 1;
}
