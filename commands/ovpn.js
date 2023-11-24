import {InteractionResponseType} from "discord-interactions";
import {editMessageByToken} from "../helper/discord";

const vpn = require('../helper/vpn');

export const metadata = {
    name: 'ovpn',
    description: 'Download vpnGate profile!',
}

export function execute(request, response) {
    response.send({
        type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
    });

    vpn.downloadData().then((vpnGate) => {
        const list = vpnGate.filter(vpn => vpn.CountryShort === "JP");

        const bySpeed = list.sort((a, b) => b.Speed - a.Speed)[0];
        let byScore = list.sort((a, b) => b.Score - a.Score);
        if (byScore[0] === bySpeed) byScore = byScore[1];
        else byScore = byScore[0];

        editMessageByToken(request.token, {
            files: [{
                attachment: Buffer.from(bySpeed.OpenVPN_ConfigData_Base64, 'base64'),
                name: bySpeed.HostName + '_' + bySpeed.IP + '.ovpn'
            }, {
                attachment: Buffer.from(byScore.OpenVPN_ConfigData_Base64, 'base64'),
                name: byScore.HostName + '_' + byScore.IP + '.ovpn'
            }]
        }).catch(console.error);
    }).catch(console.error);
}
