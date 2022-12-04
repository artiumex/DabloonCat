const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Balance = require('../../schemas/balance');
const attacky = require('../../rpg/functions/attack');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('attack')
        .setDescription('Attacks the user mentioned')
        .addUserOption(option => option.setName('target').setDescription('The user you\'d like to attack').setRequired(true)),
    async execute(interaction, client) {
        const userStoredBalance = await client.fetchBalance(interaction.user.id);
        const selectedUser = interaction.options.getUser('target');
        const selectedUserBalance = await client.fetchBalance(selectedUser.id);

        if (selectedUser.bot) return interaction.reply({
            content: `Why are you, as a ${userStoredBalance.race.toLowerCase()}, trying to fight a robot? :face_with_raised_eyebrow:`,
            ephemeral: true,
        });
        else if (selectedUser.id == interaction.user.id) return interaction.reply({
            content: "Hey man, are you okay?",
            ephemeral: true,
        });

        const attacks = await attacky(client, {
            weapon: userStoredBalance.class.weapon,
            attacker: interaction.user.toString(),
            target: selectedUser.toString(),
            attackProf: userStoredBalance,
            targetProf: selectedUserBalance,
        });

        await interaction.reply({
            embeds: attacks,
        })
    }
}