const { SlashCommandBuilder } = require('discord.js');
 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('dailies')
        .setDescription('Get yo stuff!'),
    async execute(interaction, client) {
        const storedBalance = await client.getBalance(interaction.user.id);

        if (storedBalance.dailyUse) {
            const dMoney = await client.randomNum(10) + 5;

            storedBalance.dailyUseTimeout = new Date();
            storedBalance.balance = storedBalance.balance + dMoney;
            storedBalance.hp = storedBalance.hp_max;
            storedBalance.xp += 50;
            storedBalance.save().catch(console.error);
            interaction.reply({
                content: `The dabloon gods have granted you ${await client.toDisplay('balance', dMoney)} and restored your health!`
            });
        } else {
            interaction.reply({
                content: `you did it already smh`,
                ephemeral: true
            });
        }
    }
}