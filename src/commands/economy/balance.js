const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const about = require('../../universal/about');
 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Return the balance of a user mentioned')
        .addUserOption(option => option.setName('target').setDescription('The user you\'d like to view the balance of')),
    async execute(interaction, client) {
        const selectedUser = interaction.options.getUser('target') || interaction.user;
        const storedBalance = await client.getBalance(selectedUser.id, interaction.guild.id);
        if (!storedBalance) return await interaction.reply({
            content: `${selectedUser.tag} doesnt have a balance.`,
            ephemeral: true,
        });
        else {
            const embed = new EmbedBuilder()
                .setTitle(`${selectedUser.username}`)
                // .setDescription(`${storedBalance.class} ${storedBalance.race}`)
                .setTimestamp()
                .addFields([
                    // {
                    //     name: 'Health',
                    //     value: `${storedBalance.hp}/${storedBalance.hp_max}`
                    // },
                    // {
                    //     name: 'Prowess',
                    //     value: `${storedBalance.prowess}`
                    // },
                    // {
                    //     name: 'Mettle',
                    //     value: `${storedBalance.mettle}`
                    // },
                    // {
                    //     name: 'Awe',
                    //     value: `${storedBalance.awe}`
                    // },
                    // {
                    //     name: 'Judgement',
                    //     value: `${storedBalance.judgement}`
                    // },
                    // {
                    //     name: 'Wyrd',
                    //     value: `${storedBalance.wyrd}`
                    // },
                    {
                        name: 'Coin',
                        value: `${await client.toDisplay('balance', storedBalance.balance)}`
                    }
                ])
                .setFooter({
                    text: client.user.tag,
                    iconURL: client.user.displayAvatarURL()
                });
            
            await interaction.reply({
                embeds: [embed],
                ephemeral: true,
            })
        }
    }
}