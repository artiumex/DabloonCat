const Balance = require('../../schemas/balance');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot) return;
        const storedBalance = await client.fetchBalance(message.author.id, message.guild.id);

        const luck = Math.floor(Math.random() * (20));
        if (luck !== 0) return;

        const randomAmount = Math.floor(Math.random() * (4)) + 1;

        await Balance.findOneAndUpdate({ _id: storedBalance._id }, { balance: storedBalance.balance + randomAmount });
        await client.textReact(message, 'cat');
    }
}