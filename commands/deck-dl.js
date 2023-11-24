import {CommandOptionType, editMessageByToken} from "../helper/discord";
import {InteractionResponseType} from "discord-interactions";

const deck = require('../helper/deck');

export const metadata = {
    name: 'deck-dl',
    description: 'Download deck!',
    options: [
        {
            name: 'ID',
            description: 'Deck ID',
            type: CommandOptionType.STRING,
            required: true
        }
    ]
}

export function execute(request, response) {
    response.send({
        type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
    });
    let id = request.data.options.find((option) => option.name === 'ID');

    let deckId = id.replace("https://decklog.bushiroad.com/view/", "");
    deck.downloadDeckImage(deckId).then(deckData => {
        let out = deckData.gameTitle + ' Deck《' + deckData.title + '》(' + deckId + ')\n' + deckData.deckImageUrl;
        if (deckData.subDeckImageUrl !== undefined) out += '\nSub Deck :\n' + deckData.subDeckImageUrl;

        editMessageByToken(request.token, {
            content: out
        }).catch(console.error);
    }).catch(e => {
        editMessageByToken(request.token, {
            content: e
        }).catch(console.error);
    });
}
