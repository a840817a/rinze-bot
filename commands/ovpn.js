const {InteractionResponseType} = require('discord-interactions');

const {editMessageByToken} = require('../helper/discord');

const vpn = require('../helper/vpn');

module.exports = {
    metadata: {
        name: 'ovpn',
        description: 'Download vpnGate profile!',
    },
    execute(request, response) {
        response.send({
            type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
        });

        vpn.downloadData().then((vpnGate) => {
            const list = vpnGate.filter(vpn => vpn.CountryShort === "JP");

            const bySpeed = list.sort((a, b) => b.Speed - a.Speed)[0];
            let byScore = list.sort((a, b) => b.Score - a.Score);
            if (byScore[0] === bySpeed) byScore = byScore[1];
            else byScore = byScore[0];

            let files = new FormData();
            files.append('files[0]', new Blob(Buffer.from(bySpeed.OpenVPN_ConfigData_Base64, 'base64')),
                bySpeed.HostName + '_' + bySpeed.IP + '.ovpn');
            files.append('files[1]', new Blob(Buffer.from(byScore.OpenVPN_ConfigData_Base64, 'base64')),
                byScore.HostName + '_' + byScore.IP + '.ovpn');

            editMessageByToken(request.body.token, files, 'multipart/form-data').catch(console.error);
        }).catch(console.error);
    }
}
