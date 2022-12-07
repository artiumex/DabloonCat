const { SlashCommandBuilder, ComponentType, ActionRowBuilder, SelectMenuBuilder, EmbedBuilder  } = require('discord.js');
const about = require('../../universal/about');

const pathCost = 100;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('path')
        .setDescription('Allows you to choose your class and redefine your race! Costs 100 dabloons.'),
    async execute(interaction, client) {
        const storedBalance = await client.getBalance(interaction.user.id);
        const embeds = [new EmbedBuilder()
            .setTitle(await client.toDisplay('alert', 'Big Decisions!'))
            // .setDescription(`$soem desc`)
            .setTimestamp()
            .addFields(storedBalance.attributes.arr.map(e => { 
                return { 
                    name: e.name, 
                    value: e.display,
                } 
            }))
            .setFooter({
                text: client.user.tag,
                iconURL: client.user.displayAvatarURL()
            })];
        if (storedBalance.balance < pathCost || storedBalance.level < 2) return interaction.reply({
            content: `You need to be at least Level 2 and have ${await client.toDisplay('balance', pathCost)} to change paths!`,
            ephemeral: true,
        });
        else {
            const row = new ActionRowBuilder()
			.addComponents(
				new SelectMenuBuilder()
					.setCustomId('select')
					.setPlaceholder('Nothing selected')
					.addOptions(about.classes.arr.map((e,i) => {
                        return { 
                            label: e.name, 
                            description: `${e.desc}`, 
                            value: e.id 
                        }
                    })),
			);
            const reply = await interaction.reply({ embeds: embeds, components: [row], fetchReply: true });

            const collector = reply.createMessageComponentCollector({ componentType: ComponentType.SelectMenu, time: 30000 });

            collector.on('collect', async i => {
                if (i.user.id === interaction.user.id) {
                    const choice = i.values[0];
                    storedBalance.classId = choice;
                    storedBalance.balance = storedBalance.balance - pathCost;
                    await storedBalance.save().catch(console.error);
                    i.reply(`${i.user} chose to be a **${about.classes.map.get(i.values[0]).name}**!`);
                } else {
                    i.reply({ content: `You can do **/path** to change your own path!`, ephemeral: true });
                }
            });

            collector.on('end', collected => {
                interaction.deleteReply();
                console.log(`Collected ${collected.size} interactions.`);
            });
        }
    }
}