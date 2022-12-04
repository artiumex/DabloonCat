const Balance = require('../../schemas/balance');
const about = require('../../universal/about');
const attacky = require('../../rpg/functions/attack');

module.exports = {
    name: 'messageReactionAdd',
    async execute(reaction, user, client) {
        if (user.bot || reaction.message.author.bot || reaction.message.author.id == user.id) return;

        if (['❤️','🤨','🤩'].includes(reaction.emoji.name)) {
            const userBalance = await client.fetchBalance(user.id);
            const targetBalance = await client.fetchBalance(reaction.message.author.id);
            userBalance.balance += 4;
            targetBalance.balance += 2;
            await targetBalance.save().catch(console.error);
            await userBalance.save().catch(console.error);
            return; 
        }

        const classy = about.classes.arr.find(e=>e.weapon.emoji.id == reaction.emoji.name);
        if (!classy) return;
        const userBalance = await client.fetchBalance(user.id);
        if (classy.id !== userBalance.classId) return;
        const targetBalance = await client.fetchBalance(reaction.message.author.id);

        const attacks = await attacky(client, {
            weapon: classy.weapon,
            attacker: user.toString(),
            target: reaction.message.author.toString(),
            attackProf: userBalance,
            targetProf: targetBalance,
        });

        await reaction.message.channel.send({ embeds: attacks })
        // await reaction.remove().catch(console.error);
    }
}