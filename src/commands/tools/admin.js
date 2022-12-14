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
        )
        .addSubcommand(subcommand => subcommand
            .setName('cooldown')
            .setDescription('resets cooldown for the users')
            .addUserOption(option => option
                .setName('target')
                .setDescription('The user')
                .setRequired(true)
            )
            .addStringOption(option => 
                option
                    .setName('option')
                    .setDescription('The cooldowns to reset')
                    .addChoices(
                        { name: 'Weapon', value: 'weaponUseTimeout' },
                        { name: 'Dailies', value: 'dailyUseTimeout' },
                        { name: 'All', value: 'all' },
                    )
                    .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName('nerf')
            .setDescription('Nerfs the mentioned user')
            .addUserOption(option => option
                .setName('target')
                .setDescription('The user')
                .setRequired(true)
            )
        ),
        /*.addSubcommand(subcommand => subcommand
            .setName('heal')
            .setDescription('Heals the user')
            .addUserOption(option => option
                .setName('target')
                .setDescription('The user')
                .setRequired(true)
            )
        )*/
    async execute(interaction, client) {
        var secret = true;
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
                `:computer: Booting up admin panel`
            );
            return await client.fetchBalance(target.id);
        }

        if (interaction.options.getSubcommand() == 'attribute') {
            const target = interaction.options.getUser('target');
            const amount = Math.floor(interaction.options.getInteger('value'));
            const choice = interaction.options.getString('attr');
            const targetBalance = await getTarget(target);
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
            const amount = Math.floor(interaction.options.getInteger('value'));
            const targetBalance = await getTarget(target);
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
        } else if (interaction.options.getSubcommand() == 'cooldown') {
            const choice = interaction.options.getString('option');
            const timeouts = choice == "all" ? ["dailyUseTimeout", "weaponUseTimeout"] : [choice];
            const target = interaction.options.getUser('target');
            const targetBalance = await getTarget(target);
            for (const t of timeouts) {
                targetBalance[t] = new Date(0);
            }
            await targetBalance.save().catch(console.error);
            embedy.add(
                `Cooldowns reset`,
                `${timeouts.join(', ')}`,
                "red"
            );
        } else if (interaction.options.getSubcommand() == 'nerf') {
            secret = false;
            const choice = interaction.options.getString('option');
            const target = interaction.options.getUser('target');
            const targetBalance = await getTarget(target);
            targetBalance.balance = 0;
            targetBalance.xp = 0;
            targetBalance.weaponUseTimeout = new Date(Date.parse(new Date) + 31557600000);
            targetBalance.dailyUseTimeout = new Date(Date.parse(new Date) + 31557600000);
            targetBalance.ignore = true;
            targetBalance.admin = false;
            await targetBalance.save().catch(console.error);
            embedy.add(
                `${interaction.user.tag} calls on the power of ${client.toDisplay("cat", "Dabloon Cat")}`,
                `${client.toDisplay("cat", "Dabloon Cat")} looks down on his Champion with a smile.`,
                "blue"
            ).add(
                client.toDisplay("alert", "Divine Smite!"),
                `${client.toDisplay("cat", "Dabloon Cat")} strikes down ${target}!`,
                "red"
            );
        }

        await interaction.reply({
            embeds: embedy.list,
            ephemeral: secret,
        })
    }

    

}