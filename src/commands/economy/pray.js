const { SlashCommandBuilder, ComponentType, ActionRowBuilder, SelectMenuBuilder } = require('discord.js');
const Balance = require('../../schemas/balance');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pray')
        .setDescription('Invoke the name of your god and see what boons they present you...'),
    async execute(interaction, client) {
        const userBalance = await client.fetchBalance(interaction.user.id);

        const row = new ActionRowBuilder()
        .addComponents(
            new SelectMenuBuilder()
                .setCustomId('select')
                .setPlaceholder('Nothing selected')
                .addOptions(client.godsList.map(e => {
                    return { 
                        label: e.name, 
                        description: e.desc, 
                        value: e.id 
                    }
                })),
        );
        const reply = await interaction.reply({ components: [row], fetchReply: true, ephemeral: true });

        const collector = reply.createMessageComponentCollector({ componentType: ComponentType.SelectMenu, time: 30000 });

        collector.on('collect', async i => {
            const choice = i.values[0];
            const { name, favored, pronouns } = client.godsMap.get(choice);

            const embedy = (new client.embedy).add(`Holy Shit`, `${i.user} begged to **${name}**`);
            console.log(`${i.user.tag} begged to ${name}`);
            
            // if (true) {
            if ((client.roll(`1d4`)).total == 4) {
                if (favored == userBalance.raceId) {
                    const dabamt = (client.roll(`1d10+4`, userBalance)).total;
                    const xpamt = (client.roll(`1d10+4`, userBalance)).total;
                    embedy.add(
                        `Favored!`,
                        `${name} looks down on you with favor in ${pronouns.possessive} eyes.
                        ${pronouns.subject} grants you ${client.toDisplay('balance', dabamt)} and ${xpamt} experience.`,
                        "green"
                    );
                    userBalance.balance += dabamt;
                    userBalance.xpamt += xpamt;
                } else {
                    const dabamt = (client.roll(`1d5`, userBalance)).total;
                    embedy.add(
                        `Granted!`,
                        `${name} grants you ${client.toDisplay('balance', dabamt)}, but ${pronouns.subject} is not one to forget a favor.`,
                        "cyan"
                    );
                    userBalance.balance += dabamt;
                }
                userBalance.save().catch(console.error);
            } else {
                embedy.add(
                    `Anyone There?`,
                    `${name} did not seem to respond to your prayer.`,
                    "red"
                );
            }
            i.reply({ embeds: embedy.list, ephemeral: true });
        });
    }
}