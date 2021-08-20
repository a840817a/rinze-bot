const deck = require('../helper/deck');

module.exports = {
    name: 'deck-download',
    aliases: ['deck-dl'],
    description: 'Download deck!',
    guildOnly: false,
    args: true,
    usage: '',
    async execute(message, args) {
        let msg;
        try {
            let deckId = args[0].replace("https://decklog.bushiroad.com/view/", "")
            msg = await message.reply('Loading Deck ' + deckId + ' ...');
            let deckData = await deck.downloadDeckImage(deckId);
            let out = deckData.gameTitle + ' Deck《' + deckData.title + '》(' + deckId + ')\n' + deckData.deckImageUrl
            if (deckData.subDeckImageUrl !== undefined) out += '\nSub Deck :\n' + deckData.subDeckImageUrl
            msg.edit(out);
        } catch (e) {
            msg.edit(e).catch(console.error);
        }
    },
};
