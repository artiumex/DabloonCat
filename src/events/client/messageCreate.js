const Balance = require('../../schemas/balance');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;
        const luck = (await client.roll(`1d10`)).total;
        if (luck !== 10) return;

        const storedBalance = await client.fetchBalance(message.author.id);
        const randomAmount = (await client.roll(`lvld4 &a`, storedBalance)).total;

        storedBalance.balance = storedBalance.balance + randomAmount;
        storedBalance.xp = storedBalance.xp + 10;

        await storedBalance.save().catch(console.error);
        await client.textReact(message, 'cat');
    }
}