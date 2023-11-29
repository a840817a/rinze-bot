import Joi from "joi";

const diceSchema = Joi.number().integer().min(2);
const schema = Joi.alternatives().try(diceSchema, Joi.string().regex(/(\d[dD])\d*/));

export function roll(dice: string) {
    let out = '';
    if (schema.validate(dice).error) throw new Error("Invalidate dice!");

    let input = dice.toLowerCase().split('d');
    let count = 1;
    let type: number;
    if (input.length === 2) {
        count = parseInt(input[0]);
        type = parseInt(input[1]);
    } else type = parseInt(input[0]);
    if (count < 1 || count > 10 || diceSchema.validate(type).error) throw new Error("Invalidate count!");

    let sum = 0;
    let result;
    for (let i = 0; i < count; i++) {
        result = getDiceResult(type);
        sum += result;
        out = out.concat(result.toString(), ' ');
    }
    if (count > 1) out = out.concat('(Total is : ', sum.toString(), ')');
    return out;
}

function getDiceResult(type: number) {
    let dice = getRandomInt(type);
    if (isNaN(dice) || type < 2) throw new RangeError("Invalidate range!");
    return dice;
}

function getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max)) + 1;
}
