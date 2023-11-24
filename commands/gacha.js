const {InteractionResponseType} = require('discord-interactions');

const {CommandOptionType, editMessageByToken} = require('../helper/discord');

module.exports = {
    metadata: {
        name: 'gacha',
        description: '10 gacha!',
        options: [
            {
                name: 'ssr',
                description: 'Ssr Odds',
                type: CommandOptionType.INTEGER,
                required: false
            },
            {
                name: 'sr',
                description: 'Sr Odds',
                type: CommandOptionType.INTEGER,
                required: false
            }
        ]
    },
    execute(request, response) {
        let out = '';
        const back = '<:04back:806963453142630491>';
        const ssr = '<:04ssr:806963921609031700>';
        const sr = '<:04sr:806963886229946419>';
        const r = '<:04r:806963849084665927>';

        let ssrInput = undefined;
        let srInput = undefined;

        if (request.body.data.options !== undefined) {
            ssrInput = request.body.data.options.find((option) => option.name === 'ssr');
            srInput = request.body.data.options.find((option) => option.name === 'sr');
        }

        const ssrOdds = ssrInput === undefined ? 0.03 : ssrInput.value * 1.0 / 100 || 0.03;
        const srOdds = srInput === undefined ? 0.12 : srInput.value * 1.0 / 100 || 0.12;

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

        updateMessage(request.body.token, 1, result, ssrOdds, srOdds, back, ssr, sr, r);
    }
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
    }, 150);
}
