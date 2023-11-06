import type {Request, Response} from "express";

import {ApplicationCommand, ApplicationCommandOptionType} from "../helper/discord/structure/applicationCommand";
import {editMessageByToken} from "../helper/discord/functions";
import Interaction, {InteractionResponseType} from "../helper/discord/structure/interaction";

export const metadata: ApplicationCommand = {
    name: 'gacha',
    description: '10 gacha!',
    options: [
        {
            name: 'ssr',
            description: 'Ssr Odds',
            type: ApplicationCommandOptionType.INTEGER,
            required: false
        },
        {
            name: 'sr',
            description: 'Sr Odds',
            type: ApplicationCommandOptionType.INTEGER,
            required: false
        }
    ]
}

export async function execute(request: Request, response: Response) {
    let out = '';
    const back = '<:04back:806963453142630491>';
    const ssr = '<:04ssr:806963921609031700>';
    const sr = '<:04sr:806963886229946419>';
    const r = '<:04r:806963849084665927>';

    let input = request.body as Interaction;
    let ssrInput = input.data?.options?.find((option) => option.name === 'ssr');
    let srInput = input.data?.options?.find((option) => option.name === 'sr');

    const ssrOdds = ssrInput?.value === undefined ? 0.03 : (ssrInput.value as number) / 100 || 0.03;
    const srOdds = srInput?.value === undefined ? 0.12 : (srInput.value as number) / 100 || 0.12;

    const result: number[] = [];

    for (let i = 0; i < 10; i++) {
        result.push(Math.random());
        if (i === 5) out = out.concat('\n');
        out = out.concat(back + ' ');
    }

    console.log('' + ssrOdds + ' ' + srOdds);
    console.log(result);

    response.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
            content: out,
        },
    });

    updateMessage(request.body.token, 1, result, ssrOdds, srOdds, back, ssr, sr, r);
}

function updateMessage(token: string, place: number, result: number[], ssrOdds: number, srOdds: number, back: string, ssr: string, sr: string, r: string) {
    if (place > 10) return;
    setTimeout(() => {
        let out = ''
        for (let i = 0; i < 10; i++) {
            let res = r;
            if (i === 9) res = sr;
            if (result[i] <= ssrOdds) res = ssr
            else if (result[i] <= ssrOdds + srOdds) res = sr;

            if (i === 5) out = out.concat('\n');
            if (i < place) out = out.concat(res + ' ')
            else out = out.concat(back + ' ');
        }

        editMessageByToken(token, {
            content: out
        }).then(() => {
            updateMessage(token, place + 1, result, ssrOdds, srOdds, back, ssr, sr, r);
        }).catch(console.error);
    }, 150);
}
