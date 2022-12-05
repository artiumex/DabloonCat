const { SlashCommandBuilder } = require('discord.js');
const Party = require('../../schemas/party');
const Balance = require('../../schemas/balance');
const { Types } = require('mongoose');
const crypto = require('crypto');

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
        const embedy = new client.newEmbedy;
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
        } else if (subcmd == "disband") {
            if (!storedParty) return interaction.reply({
                content: `You are not already in a party! No need to disband your imaginary party.`,
                ephemeral: true,
            });
            if (storedParty.roles.get("leader") !== interaction.user.id) return interaction.reply({
                content: `You need to be a leader in your party to disband it.`,
                ephemeral: true,
            });
            Party.findOneAndDelete({ _id: storedParty._id }).catch(console.error);
            embedy.add(
                `${storedParty.name} has disbanded.`,
                `Shame :/`,
                "red"
            );
        } else if (subcmd == "leave") {
            if (!storedParty) return interaction.reply({
                content: `You are not already in a party! No need to leave your imaginary party.`,
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
        } else if (subcmd == "recruit") {
            if (!storedParty) return interaction.reply({
                content: `You are not already in a party! Use **/party create** to form a party or ask someone to recruit you to their party.`,
                ephemeral: true,
            });
            const target = interaction.options.getUser('target');
            const targetBalance = await client.fetchBalance(target.id);
            if (targetBalance.partyId !== "none") return interaction.reply({
                content: `${target} is already in a party!`,
                ephemeral: true,
            });
            storedParty.members.set(target.id, `member`);
            targetBalance.partyId = storedParty.id;
            await storedParty.save().catch(console.error);
            await targetBalance.save().catch(console.error);
            embedy.add(
                `Member Recruited!`,
                `${target} is now a *Fighter* in the **${storedParty.name} Party**!`,
                "yellow"
            );
        } else if (subcmd == "kick") {
            if (!storedParty) return interaction.reply({
                content: `You are not already in a party! You can't kick people out of your imaginary party.`,
                ephemeral: true,
            });
            if (storedParty.roles.get("leader") !== interaction.user.id) return interaction.reply({
                content: `You need to be a leader in your party to kick members from it.`,
                ephemeral: true,
            });
            const target = interaction.options.getUser('target');
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
        } else if (subcmd == "list") {
            if (!storedParty) return interaction.reply({
                content: `You are not in a party!`,
                ephemeral: true,
            });
            const members = [];
            for (const i of storedParty.memberList) {
                members.push(`${await client.users.fetch(i.id)}: ${i.role}`);
            }
            embedy.add(
                `${storedParty.name} Members`,
                members.join('\n'),
                "random"
            );
        } else if (subcmd == "heal") {
            if (storedParty.roles.get("healer") !== interaction.user.id) return interaction.reply({
                content: `You need to be a Healer in your party to heal.`,
                ephemeral: true,
            });
            const target = interaction.options.getUser('target');
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
        }

        interaction.reply({
            embeds: embedy.list,
        })
    },
}