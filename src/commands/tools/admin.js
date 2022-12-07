const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('admin')
        .setDescription('Seven asked me to make this')
        .addSubcommand(subcommand => subcommand
            .setName('pay')
            .setDescription('Artificially inflates the price of dabloons')
            .addUserOption(option => option
                .setName('target')
                .setDescription('The user')
                .setRequired(true)
            )
            .addIntegerOption(option => option
                .setName('value')
                .setDescription('The amount to pay')
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName('gods')
            .setDescription('Manage or view gods')
            .addBooleanOption(o => o
                .setName('shuffle')
                .setDescription('Whether or not to shuffle the gods')
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName('attribute')
            .setDescription('Changes or views a user\'s attributes')
            .addUserOption(option => option
                .setName('target')
                .setDescription('The user').setRequired(true)
            )
            .addStringOption(option => 
                option
                    .setName('attr')
                    .setDescription('The attribute to view or change')
                    .addChoices(
                        { name: 'Prowess', value: 'p' },
                        { name: 'Mettle', value: 'm' },
                        { name: 'Awe', value: 'a' },
                        { name: 'Judgement', value: 'j' },
                        { name: 'Wyrd', value: 'w' },
                        { name: 'All', value: 'all' },
                    )
                    .setRequired(true)
            )
            .addIntegerOption(option => option
                .setName('value')
                .setDescription('The new value')
                .setMinValue(1)
            )
        ),
    async execute(interaction, client) {
        const selfBalance = await client.fetchBalance(interaction.user.id);
        if (selfBalance.admin == false) return interaction.reply({
            content: "You are not an admin!",
            ephemeral: true,
        });
        const embedy = new client.embedy;

        const getTarget = async (target) => {
            if (target && target.bot) return interaction.reply({
                content: "That's a bot lmao.",
                ephemeral: true,
            });
            embedy.add(
                `:computer: Booting up admin panel`,
                `Are we fucking with ${target}?`
            );
            return await client.fetchBalance(target.id);
        }

        if (interaction.options.getSubcommand() == 'attribute') {
            const target = interaction.options.getUser('target');
            const amount = interaction.options.getNumber('value');
            const choice = interaction.options.getString('attr');
            const targetBalance = await getTarget();
            const attributes = choice == "all" ? targetBalance.attributes.arr : [targetBalance.attributes.map.get(choice)];
           
            if (amount && choice !== "all") {
                targetBalance[attributes[0].raw.mid] = amount;
                await targetBalance.save().catch(console.error);
                embedy.add(
                    `Updated ${attributes[0].name}`,
                    `${attributes[0].value} -> ${amount}`,
                    "cyan"
                );
            } else {
                embedy.add(
                    `${target.tag}'s ${choice == "all" ? 'Attributes' : 'Attribute'}`,
                    "Listy yass",
                    "green",
                    attributes.map(e => {
                        return { 
                            name: e.name, 
                            value: e.display,
                        } 
                    })
                )
            }
        } else if (interaction.options.getSubcommand() == 'pay') {
            const target = interaction.options.getUser('target');
            const amount = interaction.options.getNumber('value');
            const targetBalance = await getTarget();
            const oldBal = `${targetBalance.balance}`;
            targetBalance.balance += amount;
            await targetBalance.save().catch(console.error);
            embedy.add(
                `Added ${amount} to ${target.tag}'s balance`,
                `${client.toDisplay('balance', oldBal)} -> ${client.toDisplay('balance', targetBalance.balance)}`,
                "cyan"
            );
        } else if (interaction.options.getSubcommand() == 'gods') {
            const shuffle = interaction.options.getBoolean('shuffle');
            if (shuffle == true) {
                await client.shuffleGods();
            }
            embedy.add(
                shuffle == true ? `Successfully reloaded gods!` : `Here you are!`,
                client.godsList
                    .map(e => `**${e.name}** favors *${client.rpgRaces.map.get(e.favored).name}*`)
                    .join('\n'),
                "random"
            );
        }

        await interaction.reply({
            embeds: embedy.list,
            ephemeral: true,
        })
    }
}