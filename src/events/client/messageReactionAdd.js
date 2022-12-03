const Balance = require('../../schemas/balance');
const weapons = require('../../universal/weapons');

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

        let attackEmoji = Object.keys(weapons.emoji).find(e=>weapons.emoji[e].id == reaction.emoji.name);
        if (attackEmoji) attackEmoji = weapons.emoji[attackEmoji];
        else return;
        const userBalance = await client.fetchBalance(user.id);
        if (attackEmoji.class !== userBalance.classId) return;
        const targetBalance = await client.fetchBalance(reaction.message.author.id);
        
        if (userBalance.weaponUse) userBalance.weaponUseTimeout = new Date();
        else return reaction.message.channel.send(`${user} tried to attack ${reaction.message.author}, but their ${attackEmoji.text} **${attackEmoji.name}** failed them in their time of need!`)

        const attackRoll = await client.randomNum(20) + userBalance.favored_mod;
        const damageRoll = await client.randomNum(targetBalance.hp);
        var stealRoll = await client.randomNum(targetBalance.balance / (7 - userBalance.favored_mod));
        
        if (attackRoll >= targetBalance.ac) {
            targetBalance.hp = targetBalance.hp - damageRoll;
            if (targetBalance.hp <= 0) {
                targetBalance.hp = targetBalance.hp_max;
                if (stealRoll >= targetBalance.balance) stealRoll = targetBalance.balance
                targetBalance.balance -= stealRoll;
                userBalance.balance += stealRoll;
                reaction.message.channel.send(`${user} killed ${reaction.message.author} using **${attackEmoji.act}**, and stole ${await client.toDisplay('balance',stealRoll)}.`);
            } else {
                reaction.message.channel.send(`${user} dealt ${damageRoll} damage to ${reaction.message.author} using **${attackEmoji.act}**.`);
            }
            await targetBalance.save().catch(console.error);
            await userBalance.save().catch(console.error);
        } else {
            userBalance.save().catch(console.error);
            reaction.message.channel.send(`${user} attempted to hit ${reaction.message.author} using **${attackEmoji.act}**, but missed.`);
        }

        // await reaction.remove().catch(console.error);
    }
}