import type {Request, Response} from "express";

import * as dice from "../helper/dice";
import {ApplicationCommand, ApplicationCommandOptionType} from "../helper/discord/structure/applicationCommand";
import Interaction, {InteractionResponseType} from "../helper/discord/structure/interaction";

export const metadata: ApplicationCommand = {
    name: 'roll',
    description: 'Roll dice!',
    options: [
        {
            name: 'dice',
            description: 'Dice',
            type: ApplicationCommandOptionType.STRING,
            required: true
        }
    ]
}

export async function execute(request: Request, response: Response) {
    let out = '';
    let serika0v0 = '0 ^ 0';
    let input = request.body as Interaction;

    let args = ((input.data?.options?.find((option) => option.name === 'dice')?.value ?? '') as string).split(/ +/);

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
