const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('admin')
        .setDescription('Seven asked me to make this')
        .addSubcommand(subcommand =>
            subcommand
                .setName('pay')
                .setDescription('Artificially inflates the price of dabloons')
                .addUserOption(option => option.setName('target').setDescription('The user').setRequired(true))
                .addNumberOption(option => option.setName('value').setDescription('The amount to pay').setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('attribute')
                .setDescription('Changes or views a user\'s attributes')
                .addUserOption(option => option.setName('target').setDescription('The user').setRequired(true))
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
                .addNumberOption(option => option.setName('value').setDescription('The new value'))
        ),
    async execute(interaction, client) {
        if (interaction.user.id != "256880604359032832") return interaction.reply({
            content: "No.",
            ephemeral: true,
        });

        const selectedUser = interaction.options.getUser('target');
        if (selectedUser.bot) return interaction.reply({
            content: "That's a bot lmao.",
            ephemeral: true,
        });
        const storedBalance = await client.fetchBalance(selectedUser.id);

        const embedy = new client.newEmbedy;
        embedy.add(
            `:computer: Booting up admin panel`,
            `Are we fucking with ${selectedUser}?`
        );

        if (interaction.options.getSubcommand() == 'attribute') {
            const amount = interaction.options.getNumber('value');
            const choice = interaction.options.getString('attr');
            const attributes = choice == "all" ? storedBalance.attributes.arr : [storedBalance.attributes.map.get(choice)];
           
            if (amount && choice !== "all") {
                storedBalance[attributes[0].raw.mid] = amount;
                await storedBalance.save().catch(console.error);
                embedy.add(
                    `Updated ${attributes[0].name}`,
                    `${attributes[0].value} -> ${amount}`,
                    "cyan"
                );
            } else {
                embedy.add(
                    `${selectedUser.tag}'s ${choice == "all" ? 'Attributes' : 'Attribute'}`,
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
            const amount = interaction.options.getNumber('value');
            const oldBal = `${storedBalance.balance}`;
            storedBalance.balance += amount;
            await storedBalance.save().catch(console.error);
            embedy.add(
                `Added ${amount} to ${selectedUser.tag}'s balance`,
                `${client.toDisplay('balance', oldBal)} -> ${client.toDisplay('balance', storedBalance.balance)}`,
                "cyan"
            );
        }

        await interaction.reply({
            embeds: embedy.list,
            ephemeral: true,
        })
    }
}