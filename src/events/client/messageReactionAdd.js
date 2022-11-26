const Balance = require('../../schemas/balance');
const weapons = require('../../universal/weapons');

module.exports = {
    name: 'messageReactionAdd',
    async execute(reaction, user, client) {
        if (user.bot || reaction.message.author.bot || reaction.message.author.id == user.id) return;

        let attackEmoji = Object.keys(weapons.emoji).find(e=>weapons.emoji[e].id == reaction.emoji.name);
        if (attackEmoji) attackEmoji = weapons.emoji[attackEmoji];
        else return;
        const userBalance = await client.fetchBalance(user.id, reaction.message.guild.id);
        if (attackEmoji.class !== userBalance.classId) return;
        const targetBalance = await client.fetchBalance(reaction.message.author.id, reaction.message.guild.id);
        
        const attackRoll = await client.randomNum(20) + userBalance.favored_mod;
        const damageRoll = await client.randomNum(5);
        const stealRoll = await client.randomNum(3);
        
        if (attackRoll >= targetBalance.ac) {
            targetBalance.hp = targetBalance.hp - damageRoll;
            if (targetBalance.hp <= 0) {
                targetBalance.hp = targetBalance.hp_max;
                if (targetBalance.balance >= stealRoll) {
                    targetBalance.balance -= stealRoll;
                    userBalance.balance += stealRoll;
                    reaction.message.channel.send(`${user.tag} killed ${reaction.message.author.tag} using ${attackEmoji.name}, and stole ${await client.toDisplay('balance',stealRoll)}.`);
                } else {
                    reaction.message.channel.send(`${user.tag} killed ${reaction.message.author.tag} using ${attackEmoji.name}, dealing ${damageRoll} damage.`);
                }
            } else {
                reaction.message.channel.send(`${user.tag} dealt ${damageRoll} damage to ${reaction.message.author.tag} using ${attackEmoji.name}.`);
            }
            targetBalance.save().catch(console.error);
            userBalance.save().catch(console.error);
        } else {
            reaction.message.channel.send(`${user.tag} attempted to hit ${reaction.message.author.tag} using ${attackEmoji.name}, but missed.`);
        }

        

        // await reaction.remove().catch(console.error);
    }
}