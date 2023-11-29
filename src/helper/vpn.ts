import axios from "axios";
import * as csv from "./csv";

export interface VpnGate {
    HostName: string;
    IP: string;
    Score: number;
    Ping: number;
    Speed: number;
    CountryLong: string;
    CountryShort: string;
    NumVpnSessions: number;
    Uptime: number;
    TotalUsers: number;
    TotalTraffic: number;
    LogType: string;
    Operator: string;
    Message: string;
    OpenVPN_ConfigData_Base64: string;
}

export async function downloadData() {
    let res = await axios.get('https://www.vpngate.net/api/iphone/');

    let data = (res.data as string).replace(/^(\*vpn_servers\r\n#)/, "")
        .replace(/(\r\n\*\r\n)$/, "")
        .replace("OpenVPN_ConfigData_Base64\r", "OpenVPN_ConfigData_Base64")

    return csv.toJson<VpnGate>(data);
}
