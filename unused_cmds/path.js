const { SlashCommandBuilder, ComponentType, ActionRowBuilder, SelectMenuBuilder  } = require('discord.js');
 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('path')
        .setDescription('Allows you to redefine your path!'),
    async execute(interaction, client) {
        const storedBalance = await client.getBalance(interaction.user.id, interaction.guild.id);
        if (storedBalance.balance < 100) return interaction.reply({
            content: `You need at least ${await client.toDisplay('balance',100)} to change paths!`,
            ephemeral: true,
        });
        else {
            const row = new ActionRowBuilder()
			.addComponents(
				new SelectMenuBuilder()
					.setCustomId('select')
					.setPlaceholder('Nothing selected')
					.addOptions(
						{
							label: 'Peasant',
							description: 'This is a description',
							value: 'Peasant',
						},
						{
							label: 'Arcane',
							description: 'This is also a description',
							value: 'Arcane',
						},
						{
							label: 'Warrior',
							description: 'This is also a description',
							value: 'Warrior',
						},
					),
			);
            const reply = await interaction.reply({ content: 'Some content', components: [row], fetchReply: true });

            const collector = reply.createMessageComponentCollector({ componentType: ComponentType.SelectMenu, time: 15000 });

            collector.on('collect', i => {
                if (i.user.id === interaction.user.id) {
                    i.reply(`${i.user.id} chose ${i.values[0]}`);
                } else {
                    i.reply({ content: `These buttons aren't for you!`, ephemeral: true });
                }
            });

            collector.on('end', collected => {
                console.log(`Collected ${collected.size} interactions.`);
            });
        }
    }
}