const Balance = require('../../schemas/balance');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;
        const storedBalance = await client.fetchBalance(message.author.id);

        const luck = await client.roll(`1d10`);
        if (luck !== 10) return;

        const randomAmount = await client.randomNum(4);

        storedBalance.balance = storedBalance.balance + randomAmount;
        storedBalance.xp = storedBalance.xp + 10;

        await storedBalance.save().catch(console.error);
        await client.textReact(message, 'cat');
    }
}