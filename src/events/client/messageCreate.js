const Balance = require('../../schemas/balance');
const Party = require('../../schemas/party');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;
        const luck = (await client.roll(`1d10`)).total;
        if (luck !== 10) return;

        const storedBalance = await client.fetchBalance(message.author.id);
        
        if (storedBalance.ignore == true) return client.dev ? console.log('ignoring') : "g";

        if (storedBalance.party == "none") {
            const randomAmount = (await client.roll(`lvld4 &a`, storedBalance)).total;
            storedBalance.balance = storedBalance.balance + randomAmount;
            storedBalance.xp = storedBalance.xp + 10;

            await storedBalance.save().catch(console.error);
            await client.textReact(message, 'cat');
        } else {
            const storedParty = await Party.findOne({ id: storedBalance.partyId });
            if (!storedParty) return console.log(`${message.author.tag} doesnt have a party, but has a different id?`);
            const attack = storedBalance.rollToHit;
            // ????????????????????
            // attack people
            await message.react(storedBalance.class.weapon.emoji.id);
        }
    }
}