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
            if (client.dev()) {
                fields = fields.concat(storedBalance.attributes.arr.map(e => { 
                    return { 
                        name: e.name, 
                        value: e.display, 
                    } 
                }));
            }
            if (isSelf) fields = fields.concat([
                {
                    name: 'Weapon Cooldown',
                    value: `${cooldowns.parseReadable(storedBalance.weaponUseTimeout, cooldowns.weapon)}`
                },
                {
                    name: 'Dailies Cooldown',
                    value: `${cooldowns.parseReadable(storedBalance.dailyUseTimeout, cooldowns.daily)}`
                }
            ]);
        
            const embed = await client.embedy(selectedUser.username, storedBalance.handle, "random");
            embed
                .setTimestamp()
                .addFields(fields)
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