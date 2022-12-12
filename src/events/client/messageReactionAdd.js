const Balance = require('../../schemas/balance');
const about = require('../../universal/about');

module.exports = {
    name: 'messageReactionAdd',
    async execute(reaction, user, client) {
        if (user.bot || reaction.message.author.bot || reaction.message.author.id == user.id) return;

        if (['❤️','🤨','🤩'].includes(reaction.emoji.name)) {
            const userBalance = await client.fetchBalance(user.id);
            const targetBalance = await client.fetchBalance(reaction.message.author.id);
            if (targetBalance.ignore == true || userBalance.ignore == true) return;
            userBalance.balance += 1;
            targetBalance.balance += 1;
            await targetBalance.save().catch(console.error);
            await userBalance.save().catch(console.error);
            return; 
        }
        // await reaction.remove().catch(console.error);
    }
}