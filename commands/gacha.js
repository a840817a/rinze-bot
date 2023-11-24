import {CommandOptionType, editMessageByToken} from "../helper/discord";
import {InteractionResponseType} from "discord-interactions";

export const metadata = {
    name: 'gacha',
    description: '10 gacha!',
    options: [
        {
            name: 'ssrOdds',
            description: 'Ssr Odds',
            type: CommandOptionType.INTEGER,
            required: false
        },
        {
            name: 'srOdds',
            description: 'Sr Odds',
            type: CommandOptionType.INTEGER,
            required: false
        }
    ]
}

export function execute(request, response) {
    let out = '';
    const back = '[...]';
    const ssr = '[SSR]';
    const sr = '[SR]';
    const r = '[R]';

    const ssrOdds = request.data.options.find((option) => option.name === 'ssrOdds') * 1.0 / 100 || 0.03;
    const srOdds = request.data.options.find((option) => option.name === 'srOdds') * 1.0 / 100 || 0.12;

    const result = [];

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

    updateMessage(request.token, 1, result, ssrOdds, srOdds, back, ssr, sr, r);
}

function updateMessage(token, place, result, ssrOdds, srOdds, back, ssr, sr, r) {
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
        }).then((msg) => {
            updateMessage(token, place + 1, result, ssrOdds, srOdds, back, ssr, sr, r);
        }).catch(console.error);
    }, 1000);
}
