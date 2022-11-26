const { SlashCommandBuilder } = require('discord.js');
 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('dailies')
        .setDescription('Get yo stuff!'),
    async execute(interaction, client) {
        const storedBalance = await client.getBalance(interaction.user.id, interaction.guild.id);

        if (storedBalance.dailyUse) {
            dMoney = client.randomNum(10);

            storedBalance.getBalance + dMoney;
            storedBalance.dailyUseTimeout = new Date();
            storedBalance.save().catch(error);
            interaction.reply({
                content: `${client.toDisplay('balance',dMoney)}`
            });
        } else {
            interaction.reply({
                content: `you did it already smh`,
                ephemeral: true
            });
        }
    }
}