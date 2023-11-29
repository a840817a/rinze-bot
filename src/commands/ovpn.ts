import type {Request, Response} from "express";

import {editMessageByToken} from "../helper/discord/functions";
import * as vpn from "../helper/vpn";
import {VpnGate} from "../helper/vpn";
import {InteractionResponseType} from "../helper/discord/structure/interaction";
import {ApplicationCommand} from "../helper/discord/structure/applicationCommand";

export const metadata: ApplicationCommand = {
    name: 'ovpn',
    description: 'Download vpnGate profile!',
}

export async function execute(request: Request, response: Response) {
    response.send({
        type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
    });

    try {
        let vpnGate = await vpn.downloadData();
        const list = vpnGate.filter(vpn => vpn.CountryShort === "JP");

        const bySpeed = list.sort((a, b) => b.Speed - a.Speed)[0];
        let byScoreList = list.sort((a, b) => b.Score - a.Score);

        let byScore: VpnGate;
        if (byScoreList[0] === bySpeed) byScore = byScoreList[1];
        else byScore = byScoreList[0];

        let files = new FormData();
        files.append('files[0]', base64toBlob(bySpeed.OpenVPN_ConfigData_Base64),
            bySpeed.HostName + '_' + bySpeed.IP + '.ovpn');
        files.append('files[1]', base64toBlob(byScore.OpenVPN_ConfigData_Base64),
            byScore.HostName + '_' + byScore.IP + '.ovpn');

        await editMessageByToken(request.body.token, files, 'multipart/form-data');
    } catch (e) {
        editMessageByToken(request.body.token, {
            content: e
        }).catch(console.error);
    }
}

function base64toBlob(b64Data: string, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, {type: contentType});
}
