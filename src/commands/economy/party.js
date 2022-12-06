const { SlashCommandBuilder, ComponentType, ActionRowBuilder, ButtonBuilder, ButtonStyle, SelectMenuBuilder } = require('discord.js');
const Party = require('../../schemas/party');
const Balance = require('../../schemas/balance');
const about = require('../../universal/aboutParties');
const { Types } = require('mongoose');
const crypto = require('crypto');
const { recruit } = require('../../universal/aboutParties');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('party')
        .setDescription('Party commands')
        .addSubcommand(subcommand => subcommand
            .setName('create')
            .setDescription('Create a party, if you\'re not apart of one')
            .addStringOption(option => option
                .setName('name')
                .setDescription('The name of your new party!')
                .setRequired(true)
            )
            .addStringOption(option => option
                .setName('description')
                .setDescription('Describe your new party')
                .setRequired(true)
            )
        )
        .addSubcommand(subcommand => subcommand
            .setName('disband')
            .setDescription('Disband your party. Note: this is irreversible!')
        )
        .addSubcommand(subcommand => subcommand
            .setName('delegate')
            .setDescription('Assign roles to your party members')
            .addUserOption(option => option.setName('target').setDescription('The user you\'d like to delegate').setRequired(true))
        )
        .addSubcommand(subcommand => subcommand
            .setName('leave')
            .setDescription('Leave your current party. Note: you will need to be recruited again to rejoin your party!')
        )
        .addSubcommand(subcommand => subcommand
            .setName('recruit')
            .setDescription('Create a party, if you\'re not apart of one')
            .addUserOption(option => option.setName('target').setDescription('The user you\'d like to recruit').setRequired(true))
        )
        .addSubcommand(subcommand => subcommand
            .setName('kick')
            .setDescription('Kicks a member from your party')
            .addUserOption(option => option.setName('target').setDescription('The user you\'d like to kick').setRequired(true))
        )
        .addSubcommand(subcommand => subcommand
            .setName('list')
            .setDescription('Lists the members in your party')
        )
        .addSubcommand(subcommand => subcommand
            .setName('heal')
            .setDescription('Heals a member of your party')
            .addUserOption(option => option.setName('target').setDescription('The user you\'d like to heal').setRequired(true))
        )
        /*.addSubcommand(subcommand => subcommand
            .setName('start event')
            .setDescription('Start an adventure')
        )*/,
    async execute(interaction, client) {
        const subcmd = interaction.options.getSubcommand();
        const storedBalance = await client.fetchBalance(interaction.user.id);
        const storedParty = await client.getParty(storedBalance.partyId);
        const embedy = new client.embedy;
        const finish = (reply = true) => {
            if (reply) {
                interaction.reply({
                    embeds: embedy.list,
                });
            } else {
                interaction.editReply({
                    embeds: embedy.list,
                    components: [],
                });
            }
        }
        const target = interaction.options.getUser('target');
        if (target) {
            if (target.bot) return interaction.reply({
                content: target.id == client.user.id ? `Thanks, but I am a bot.` : `That is a bot.`,
                ephemeral: true,
            });
        }
        if (subcmd == "create") {
            if (storedParty) return interaction.reply({
                content: `You are already in a party! No need to create a new one.`,
                ephemeral: true,
            });
            const partyName = interaction.options.getString('name');
            const partyDesc = interaction.options.getString('description');
            const memberList = {};
            memberList[interaction.user.id] = "leader";
            const newParty = new Party({
                _id: Types.ObjectId(),
                name: partyName,
                id: crypto.randomUUID(),
                description: partyDesc,
                members: memberList,
            });
            storedBalance.partyId = newParty.id;
            await storedBalance.save().catch(console.error);
            await newParty.save().catch(console.error);
            embedy.add(
                `Party Created!`, 
                `A new party, one called "${partyName}", has banded!
                Current Members: ${interaction.user}`,
                "random"
            );
            return finish();
        } else if (subcmd == "disband") {
            if (!storedParty) return interaction.reply({
                content: `You are not already in a party! No need to disband your imaginary party.`,
                ephemeral: true,
            });
            if (storedParty.roles.get("leader") !== interaction.user.id) return interaction.reply({
                content: `You need to be a leader in your party to disband it.`,
                ephemeral: true,
            });
            await Party.updateMany({ partyId: storedParty.id }, { partyId: "none" }).catch(console.error);
            await Party.findOneAndDelete({ _id: storedParty._id }).catch(console.error);
            embedy.add(
                `${storedParty.name} has disbanded.`,
                `Shame :/`,
                "red"
            );
            return finish();
        } else if (subcmd == "leave") {
            if (!storedParty) return interaction.reply({
                content: `You are not already in a party! No need to leave your imaginary party.`,
                ephemeral: true,
            });
            if(storedParty.roles.get("leader") == interaction.user.id) return interaction.reply({
                content: `You are the leader of your party! Promote someone in your party to Leader before leaving using **/party delegate**.`,
                ephemeral: true,
            });
            storedParty.members.delete(interaction.user.id);
            storedBalance.partyId = "none";
            await storedBalance.save().catch(console.error);
            await storedParty.save().catch(console.error);
            embedy.add(
                `${interaction.user.tag} left`,
                `${storedParty.name} has one less member.`,
                "magenta"
            );
            return finish();
        } else if (subcmd == "recruit") {
            if (!storedParty) return interaction.reply({
                content: `You are not already in a party! Use **/party create** to form a party.`,
                ephemeral: true,
            });
            const targetBalance = await client.fetchBalance(target.id);
            if (targetBalance.partyId !== "none") return interaction.reply({
                content: `${target} is already in a party!`,
                ephemeral: true,
            });
            const row = new ActionRowBuilder()
                .addComponents(new ButtonBuilder()
                    .setCustomId('yes')
                    .setLabel('Yes!')
                    .setStyle(ButtonStyle.Success),
                )
                .addComponents(new ButtonBuilder()
                    .setCustomId('no')
                    .setLabel('No')
                    .setStyle(ButtonStyle.Danger),
                );
            const reply = await interaction.reply({ components: [row], fetchReply: true });

            const collector = reply.createMessageComponentCollector({ componentType: ComponentType.Button, time: 30000 });

            collector.on('collect', async i => {
                if (i.user.id === target.id) {
                    if (i.customId == "yes") {
                        storedParty.members.set(target.id, `member`);
                        targetBalance.partyId = storedParty.id;
                        await storedParty.save().catch(console.error);
                        await targetBalance.save().catch(console.error);
                        embedy.add(
                            `Member Recruited!`,
                            `${target} is now a *Fighter* in the **${storedParty.name} Party**!`,
                            "yellow"
                        );
                    } else {
                        embedy.add(
                            `Recruitment declined!`,
                            `${targer} does not wish to join the **${storedParty.name} Party**.`,
                            `red`
                        );
                    }
                    collector.stop("response from target");
                    finish(false);
                } else {
                    i.reply({ content: `You are not the person this is for!`, ephemeral: true });
                }
            });

            collector.on('end', collected => {
                if (collector.endReason !== "response from target") interaction.followUp({
                    content: `Guess they didn't want to join your party :/`,
                });
                console.log(`Collected ${collected.size} interactions.`);
            });
        } else if (subcmd == "kick") {
            if (!storedParty) return interaction.reply({
                content: `You are not already in a party! You can't kick people out of your imaginary party.`,
                ephemeral: true,
            });
            if (storedParty.roles.get("leader") !== interaction.user.id) return interaction.reply({
                content: `You need to be a leader in your party to kick members from it.`,
                ephemeral: true,
            });
            const targetBalance = await client.fetchBalance(target.id);
            if (targetBalance.partyId !== storedParty.id) return interaction.reply({
                content: `${target} is not in your party!`,
                ephemeral: true,
            });
            storedParty.members.delete(target.id);
            targetBalance.partyId = "none";
            await targetBalance.save().catch(console.error);
            await storedParty.save().catch(console.error);
            embedy.add(
                `Member Kick!`,
                `${target} is no longer in your party.`,
                "magenta"
            );
            return finish();
        } else if (subcmd == "list") {
            if (!storedParty) return interaction.reply({
                content: `You are not in a party!`,
                ephemeral: true,
            });
            const members = [];
            for (const i of storedParty.memberList) {
                members.push(`${await client.users.fetch(i.id)}: ${i.role.display}`);
            }
            embedy.add(
                `${storedParty.name} Members`,
                members.join('\n'),
                "random"
            );
            return finish();
        } else if (subcmd == "heal") {
            if (!storedParty) return interaction.reply({
                content: `You are not already in a party!`,
                ephemeral: true,
            });
            if (storedParty.roles.get("healer") !== interaction.user.id) return interaction.reply({
                content: `You need to be a Healer in your party to heal.`,
                ephemeral: true,
            });
            const targetBalance = await client.fetchBalance(target.id);
            if (targetBalance.partyId !== storedParty.id) return interaction.reply({
                content: `${target} is not in your party!`,
                ephemeral: true,
            });
            targetBalance.hp = targetBalance.hp_max;
            await storedBalance.save().catch(console.error);
            embedy.add(
                `Member Heal!`,
                `${target} has had their Hit Points restored.`,
                "blue"
            );
            return finish();
        } else if (subcmd == "delegate") {
            if (!storedParty) return interaction.reply({
                content: `You are not already in a party!`,
                ephemeral: true,
            });
            if (storedParty.roles.get("leader") !== interaction.user.id) return interaction.reply({
                content: `You need to be a leader in your party to delegate members.`,
                ephemeral: true,
            });
            const targetBalance = await client.fetchBalance(target.id);
            if (targetBalance.partyId !== storedParty.id) return interaction.reply({
                content: `${target} is not in your party!`,
                ephemeral: true,
            });
            const row = new ActionRowBuilder()
                .addComponents(
                    new SelectMenuBuilder()
                        .setCustomId('select')
                        .setPlaceholder('Nothing selected')
                        .addOptions(about.rolesIds(false).map(e => {
                            const roledata = about.roles[e];
                            return { 
                                label: roledata.display, 
                                description: roledata.desc, 
                                value: e,
                            }
                        })),
                );
            const reply = await interaction.reply({ components: [row], fetchReply: true, ephemeral: true });

            const collector = reply.createMessageComponentCollector({ componentType: ComponentType.SelectMenu, time: 30000 });

            collector.on('collect', async i => {
                const choice = i.values[0];
                if (choice !== "member") {
                    const rolefilled = storedParty.roles.get(choice);
                    if (rolefilled){
                        storedParty.members.set(rolefilled, "member");
                        const victim = await client.users.fetch(rolefilled);
                        embedy.add(
                            `${victim.tag} demoted`,
                            `${victim} is now a Fighter`,
                            "red"
                        );
                    }
                }
                storedParty.members.set(target.id, choice);
                await storedParty.save().catch(console.error);
                embedy.add(
                    false,
                    `${target} is now a ${about.roles[choice].display}`,
                    "green"
                );
                collector.stop();
                return finish(false);
            });
        }
    },
}