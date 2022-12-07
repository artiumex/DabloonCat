const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const about = require('../../universal/about');
const cooldowns = require('../../universal/cooldowns');
 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Return the balance of a user mentioned')
        .addUserOption(option => option.setName('target').setDescription('The user you\'d like to view the balance of')),
    async execute(interaction, client) {
        const selectedUser = interaction.options.getUser('target') || interaction.user;
        const storedBalance = await client.getBalance(selectedUser.id);
        const isSelf = interaction.options.getUser('target') ? false : true;
        if (!storedBalance) return await interaction.reply({
            content: `${selectedUser.tag} doesnt have a balance.`,
            ephemeral: true,
        });
        else {
            var fields = [
                {
                    name: 'Health',
                    value: `${storedBalance.hp}/${storedBalance.hp_max}`
                },
                {
                    name: 'XP',
                    value: `Level ${storedBalance.level}/${storedBalance.xp} xp`
                },
                {
                    name: 'Coin',
                    value: `${await client.toDisplay('balance', storedBalance.balance)}`
                }
            ];
            if (client.dev || storedBalance.admin == true) {
                fields = fields.concat(storedBalance.attributes.fields);
            }
            if (isSelf || storedBalance.admin == true) fields = fields.concat([
                {
                    name: 'Weapon Cooldown',
                    value: `${cooldowns.parseReadable(storedBalance.weaponUseTimeout, cooldowns.weapon)}`
                },
                {
                    name: 'Dailies Cooldown',
                    value: `${cooldowns.parseReadable(storedBalance.dailyUseTimeout, cooldowns.daily)}`
                }
            ]);
        
            const embedy = (new client.embedy).add(selectedUser.tag, storedBalance.handle, "random", fields, true);

            await interaction.reply({
                embeds: embedy.list,
                ephemeral: true,
            })
        }
    }
}