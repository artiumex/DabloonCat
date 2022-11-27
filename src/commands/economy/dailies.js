const { SlashCommandBuilder } = require('discord.js');
 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('dailies')
        .setDescription('Get yo stuff!'),
    async execute(interaction, client) {
        const storedBalance = await client.getBalance(interaction.user.id, interaction.guild.id);

        if (storedBalance.dailyUse) {
            dMoney = await client.randomNum(10);

            storedBalance.balance = storedBalance.balance + dMoney;
            storedBalance.dailyUseTimeout = new Date();
            storedBalance.save().catch(console.error);
            interaction.reply({
                content: `The dabloon gods have granted you ${await client.toDisplay('balance', dMoney)}`
            });
        } else {
            interaction.reply({
                content: `you did it already smh`,
                ephemeral: true
            });
        }
    }
}