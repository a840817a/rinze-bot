const axios = require("axios");
const csv = require('../helper/csv');

module.exports = {
    async downloadData() {
        let res = await axios.get('https://www.vpngate.net/api/iphone/');

        let data = res.data.replace(/^(\*vpn_servers\r\n#)/, "")
            .replace(/(\r\n\*\r\n)$/, "")
            .replace("OpenVPN_ConfigData_Base64\r", "OpenVPN_ConfigData_Base64")

        return csv.toJson(data);
    }
}
