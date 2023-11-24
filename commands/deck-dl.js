const {InteractionResponseType} = require('discord-interactions');

const {CommandOptionType, editMessageByToken} = require('../helper/discord');
const deck = require('../helper/deck');

module.exports = {
    metadata: {
        name: 'deck-dl',
        description: 'Download deck!',
        options: [
            {
                name: 'id',
                description: 'Deck ID',
                type: CommandOptionType.STRING,
                required: true
            }
        ]
    },
    execute(request, response) {
        response.send({
            type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE,
        });
        let id = request.body.data.options.find((option) => option.name === 'id').value;

        let deckId = id.replace("https://decklog.bushiroad.com/view/", "");
        deck.downloadDeckImage(deckId).then(deckData => {
            let out = deckData.gameTitle + ' Deck《' + deckData.title + '》(' + deckId + ')\n' + deckData.deckImageUrl;
            if (deckData.subDeckImageUrl !== undefined) out += '\nSub Deck :\n' + deckData.subDeckImageUrl;

            editMessageByToken(request.body.token, {
                content: out
            }).catch(console.error);
        }).catch(e => {
            editMessageByToken(request.body.token, {
                content: e
            }).catch(console.error);
        });
    }
}
