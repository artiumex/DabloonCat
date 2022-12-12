const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Balance = require('../../schemas/balance');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pay')
        .setDescription('Pays the user mentioned')
        .addUserOption(option => option
            .setName('target')
            .setDescription('The user you\'d like to pay')
            .setRequired(true)
        )
        .addIntegerOption(option => option
            .setName('amount')
            .setDescription('The amount you would like to send.')
            .setRequired(true)
            .setMinValue(1)
        ),
    async execute(interaction, client) {
        const target = interaction.options.getUser('target');
        const storedBalance = await client.fetchBalance(interaction.user.id);
        const targetBalance = await client.fetchBalance(target);
        const amount = Math.floor(interaction.options.getInteger('amount'));

        if (target.bot) return interaction.reply({
            content: "You cannot send dabloons to a bot!",
            ephemeral: true,
        });
        else if (target.id == interaction.user.id) return interaction.reply({
            content: "Stop trying to launder dabloons!!!",
            ephemeral: true,
        });
        else if (amount > storedBalance.balance) return interaction.reply({
            content: `You do not have enough ${await client.toDisplay('money')} to send!`,
            ephemeral: true,
        });
        else if (targetBalance.ignore == true) return interaction.reply({
            content: "You can not pay this person!",
            ephemeral: true,
        });
        
        storedBalance.balance -= amount;
        targetBalance.balance += amount;
        storedBalance.save().catch(console.error);
        targetBalance.save().catch(console.error);
        await interaction.reply({
            content: `You've sent ${await client.toDisplay('balance', amount)} to ${target.tag}`,
            // ephemeral: true,
        })
    }
}