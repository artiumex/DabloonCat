const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Balance = require('../../schemas/balance');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pay')
        .setDescription('Pays the user mentioned')
        .addUserOption(option => option.setName('target').setDescription('The user you\'d like to pay').setRequired(true))
        .addNumberOption(option => option
            .setName('amount')
            .setDescription('The amount you would like to send.')
            .setMinValue(1)
            .setRequired(true)
        ),
    async execute(interaction, client) {
        const userStoredBalance = await client.fetchBalance(interaction.user.id);
        const amount = interaction.options.getNumber('amount');
        const selectedUser = interaction.options.getUser('target');

        if (selectedUser.bot) return interaction.reply({
            content: "You cannot send dabloons to a bot!",
            ephemeral: true,
        });
        else if (selectedUser.id == interaction.user.id) return interaction.reply({
            content: "Stop trying to launder dabloons!!!",
            ephemeral: true,
        });
        else if (amount > userStoredBalance.balance) return interaction.reply({
            content: `You do not have enough ${await client.toDisplay('money')} to send!`,
            ephemeral: true,
        });
        
        const selectedUserBalance = await client.fetchBalance(selectedUser.id);
        await Balance.findOneAndUpdate({ _id: userStoredBalance._id }, { balance: userStoredBalance.balance - amount });
        await Balance.findOneAndUpdate({ _id: selectedUserBalance._id }, { balance: selectedUserBalance.balance + amount });

        await interaction.reply({
            content: `You've sent ${await client.toDisplay('balance', amount)} to ${selectedUser.tag}`,
            // ephemeral: true,
        })
    }
}