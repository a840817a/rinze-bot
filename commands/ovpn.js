const vpn = require('../helper/vpn');

module.exports = {
    name: 'ovpn',
    aliases: [],
    description: 'Download vpnGate profile!',
    guildOnly: false,
    args: false,
    usage: '',
    execute(message, args) {
        vpn.downloadData().then((vpnGate) => {
            const list = vpnGate.filter(vpn => vpn.CountryShort === "jp");

            const bySpeed = list.sort((a, b) => b.Speed - a.Speed)[0];
            let byScore = list.sort((a, b) => b.Score - a.Score);
            if (byScore[0] === bySpeed) byScore = byScore[1];
            else byScore = byScore[0];

            message.channel.send({
                files: [{
                    attachment: Buffer.from(bySpeed.OpenVPN_ConfigData_Base64, 'base64'),
                    name: bySpeed.HostName + '_' + bySpeed.IP + '.ovpn'
                },{
                    attachment: Buffer.from(byScore.OpenVPN_ConfigData_Base64, 'base64'),
                    name: byScore.HostName + '_' + byScore.IP + '.ovpn'
                }]
            }).catch(console.error);
        }).catch(console.error);
    },
};
