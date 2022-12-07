const { SlashCommandBuilder, ComponentType, ActionRowBuilder, SelectMenuBuilder, EmbedBuilder  } = require('discord.js');
const about = require('../../universal/about');

const price = {
    race: 1000,
    class: 100,
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('path')
        .setDescription('Allows you to choose your class and redefine your race!')
        .addSubcommand(subcommand => subcommand
            .setName('race')
            .setDescription(`Change your race (not in a weird way but in a D&D way). Costs ${price.race} dabloons.`)
        )
        .addSubcommand(subcommand => subcommand
            .setName('class')
            .setDescription(`Change your class. Costs ${price.class} dabloons.`)
        ),
    async execute(interaction, client) {
        const subcmd = interaction.options.getSubcommand();
        const chosenGrab = about[`${subcmd}${subcmd.endsWith('e') ? "s" : "es"}`];
        const chosenId = subcmd + "Id";
        const storedBalance = await client.getBalance(interaction.user.id);
        const embedy = (new client.embedy).add(
            client.toDisplay('alert', 'Big Decisions!'),
            `Use your attributes (listed below) to choose your ${subcmd}!`,
            "random",
            storedBalance.attributes.arr.map(e => { 
                return { 
                    name: e.name, 
                    value: e.display,
                } 
            }),
            true
        );

        const pathCost = price[subcmd];
        
        if (storedBalance.balance < pathCost || storedBalance.level < 2) return interaction.reply({
            content: `You need to be at least Level 2 and have ${await client.toDisplay('balance', pathCost)} to change your ${subcmd}!`,
            ephemeral: true,
        });
        const row = new ActionRowBuilder()
			.addComponents(
				new SelectMenuBuilder()
					.setCustomId('select')
					.setPlaceholder(`Choose your ${chosenGrab.type} from the dropdown below!`)
					.addOptions(chosenGrab.arr.map((e) => {
                        return { 
                            label: e.name, 
                            description: `${e.desc}`, 
                            value: e.id 
                        }
                    })),
			);

        const reply = await interaction.reply({ embeds: embedy.list, components: [row], fetchReply: true });

        const collector = reply.createMessageComponentCollector({ componentType: ComponentType.SelectMenu, time: 30000 });

        collector.on('collect', async i => {
            if (i.user.id === interaction.user.id) {
                const choice = i.values[0];
                storedBalance[chosenId] = choice;
                storedBalance.balance = storedBalance.balance - pathCost;
                await storedBalance.save().catch(console.error);
                i.reply(`${i.user} chose **${chosenGrab.map.get(i.values[0]).name}** for their ${chosenGrab.type}!`);
                collector.stop();
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