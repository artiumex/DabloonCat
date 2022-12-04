module.exports = async (client, attack_data) => {
    const { weapon, attacker, attackProf, target, targetProf } = attack_data;
    const wdisplay = `${weapon.emoji.text} **${weapon.name}**`;

    if (attackProf.weaponUse || client.dev()) attackProf.weaponUseTimeout = new Date();
    else {
        const embed = await client.embedy(
            "Weapon Exhaustion!", 
            `${attacker} attempts to attack ${target}, but their ${wdisplay} failed them in their time of need!`, 
            "red"
        );
        return [embed];
    }

    const attackRoll = attackProf.rollToHit;
    const damageRoll = attackProf.rollDamage;
    var stealRoll = 4;

    const embeds = [await client.embedy(
        `${weapon.act} Attack!`, 
        `${attacker} attacks ${target} using ${wdisplay}! They roll a ${attackRoll.total} to hit!`
    )];
    
    if (attackRoll.total >= targetProf.ac) {
        embeds.push(await client.embedy(
            "Hit!", 
            `${attacker} dealt ${damageRoll.total} damage to ${target}!`,
            "green"
        ));
        targetProf.hp = targetProf.hp - damageRoll.total;
        if (targetProf.hp <= 0) {
            targetProf.hp = targetProf.hp_max;
            if (stealRoll >= targetProf.balance) stealRoll = targetProf.balance
            targetProf.balance -= stealRoll;
            attackProf.balance += stealRoll;
            attackProf.xp += 20;
            embeds.push(await client.embedy(
                "Slay!", 
                `${attacker} killed ${target} and stole ${await client.toDisplay('balance', stealRoll)}.`, 
                "cyan"
            ));
        }
        await targetProf.save().catch(console.error);
        await attackProf.save().catch(console.error);
    } else {
        attackProf.save().catch(console.error);
        embeds.push(await client.embedy(
            "Miss!", 
            `${target}'s Armor Class is higher than ${attackRoll.total}!`,
            "red"
        ));
    }
    return embeds
}