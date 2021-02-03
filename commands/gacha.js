module.exports = {
    name: 'gacha',
    aliases: [],
    description: '10 gacha!',
    guildOnly: false,
    args: false,
    usage: '',
    execute(message, args) {
        let out = '';
        const back = '[...]';
        const ssr = '[SSR]';
        const sr = '[SR]';
        const r = '[R]';

        const ssrOdds = args[0] * 1.0 / 100 || 0.03;
        const srOdds = args[1] * 1.0 / 100 || 0.12;

        const result = [];

        for (let i = 0; i < 10; i++) {
            result.push(Math.random());
            if (i === 5) out = out.concat('\n');
            out = out.concat(back + ' ');
        }

        console.log('' + ssrOdds + ' ' + srOdds);
        console.log(result);

        message.channel.send(out)
            .then((msg) => {
                updateMessage(msg, 1, result, ssrOdds, srOdds, back, ssr, sr, r);
            })
            .catch(console.error);
    },
};

function updateMessage(message, place, result, ssrOdds, srOdds, back, ssr, sr, r) {
    if (place > 10) return;
    setTimeout(() => {
        let out = ''
        for (let i = 0; i < 10; i++) {
            let res = r;
            if (i === 9) res = sr;
            if (result[i] <= ssrOdds) res = ssr
            else if (result[i] <= ssrOdds + srOdds) res = sr;

            if (i === 5) out = out.concat('\n');
            if (i < place)  out = out.concat(res + ' ')
            else out = out.concat(back + ' ');
        }
        message.edit(out)
            .then((msg) => {
                updateMessage(msg, place + 1, result, ssrOdds, srOdds, back, ssr, sr, r);
            })
            .catch(console.error);
    }, 150);
}
