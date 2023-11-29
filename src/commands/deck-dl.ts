import {editMessageByToken} from "../helper/discord/functions";
import {ApplicationCommand, ApplicationCommandOptionType} from "../helper/discord/structure/applicationCommand";
import Interaction, {InteractionResponseType} from "../helper/discord/structure/interaction";
import * as deck from "../helper/deck/deck";
import {Request, Response} from "express";

export const metadata: ApplicationCommand = {
    name: 'deck-dl',
    description: 'Download deck!',
    options: [
        {
            name: 'id',
            description: 'Deck ID',
            type: ApplicationCommandOptionType.STRING,
            required: true
        }
    ]
}

export async function execute(request: Request, response: Response) {
    let input = request.body as Interaction;
    let id = input.data?.options?.find((option) => option.name === 'id')?.value as string ?? '';

    response.send({
        type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
    });

    let deckId = id.replace("https://decklog.bushiroad.com/view/", "");

    try {
        let deckData = await deck.downloadDeckImage(deckId);

        let out = deckData.gameTitle + ' Deck《' + deckData.title + '》(' + deckId + ')\n' + deckData.deckImageUrl;
        if (deckData.subDeckImageUrl !== undefined) out += '\nSub Deck :\n' + deckData.subDeckImageUrl;

        await editMessageByToken(request.body.token, {content: out});
    } catch (e) {
        editMessageByToken(request.body.token, {
            content: e
        }).catch(console.error);
    }
}
