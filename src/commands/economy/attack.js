const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Balance = require('../../schemas/balance');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('attack')
        .setDescription('Attacks the user mentioned')
        .addUserOption(option => option.setName('target').setDescription('The user you\'d like to attack').setRequired(true)),
    context_compatible: true,
    async execute(interaction, client) {
        const userStoredBalance = await client.fetchBalance(interaction.user.id);
        const selectedUser = interaction.options.getUser('target');
        const selectedUserBalance = await client.fetchBalance(selectedUser.id);

        if (selectedUser.bot) return interaction.reply({
            content: `Why are you, as a ${userStoredBalance.race.name.toLowerCase()}, trying to fight a robot? :face_with_raised_eyebrow:`,
            ephemeral: true,
        });
        else if (selectedUser.id == interaction.user.id) return interaction.reply({
            content: "Hey man, are you okay?",
            ephemeral: true,
        });

        const embedy = client.intEmbedy(interaction);

        const { weapon, attacker, attackProf, target, targetProf } = {
            weapon: userStoredBalance.class.weapon,
            attacker: interaction.user.toString(),
            target: selectedUser.toString(),
            attackProf: userStoredBalance,
            targetProf: selectedUserBalance,
        };
        const wdisplay = `${weapon.emoji.text} **${weapon.name}**`;

        if (attackProf.weaponUse || client.dev) attackProf.weaponUseTimeout = new Date();
        else {
            await embedy.add(
                "Weapon Exhaustion!", 
                `${attacker} attempts to attack ${target}, but their ${wdisplay} failed them in their time of need!`, 
                "red"
            );
            return embedy;
        }
        
        if (targetProf.ignore == true) return await embedy.add(
            "Divine Intervention!",
            `${client.toDisplay("cat", "Dabloon Cat")} notices you attempt to attack his chosen, and intercepts your attack!`,
            "hotpink"
        );

        const attackRoll = attackProf.rollToHit;
        const damageRoll = attackProf.rollDamage;
        var stealRoll = 4;

        await embedy.add(
            `${weapon.act} Attack!`, 
            `${attacker} attacks ${target} using ${wdisplay}! They roll a ${attackRoll.total} to hit!`
        );
        
        if (attackRoll.total >= targetProf.ac) {
            await embedy.add(
                "Hit!", 
                `${attacker} dealt ${damageRoll.total} damage to ${target}!`,
                "green"
            );
            targetProf.hp = targetProf.hp - damageRoll.total;
            if (targetProf.hp <= 0) {
                targetProf.hp = targetProf.hp_max;
                if (stealRoll >= targetProf.balance) stealRoll = targetProf.balance
                targetProf.balance -= stealRoll;
                attackProf.balance += stealRoll;
                attackProf.xp += 20;
                await embedy.add(
                    "Slay!", 
                    `${attacker} killed ${target} and stole ${await client.toDisplay('balance', stealRoll)}.`, 
                    "cyan"
                );
            }
            await targetProf.save().catch(console.error);
            await attackProf.save().catch(console.error);
        } else {
            attackProf.save().catch(console.error);
            await embedy.add(
                "Miss!", 
                `${target}'s Armor Class is higher than ${attackRoll.total}!`,
                "red"
            );
        }
    }
}