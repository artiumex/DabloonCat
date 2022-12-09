module.exports = async (client, attack_data) => {
    const { weapon, attacker, attackProf, target, targetProf } = attack_data;
    const wdisplay = `${weapon.emoji.text} **${weapon.name}**`;
    const embedy = new client.embedy;

    if (attackProf.weaponUse || client.dev) attackProf.weaponUseTimeout = new Date();
    else {
        embedy.add(
            "Weapon Exhaustion!", 
            `${attacker} attempts to attack ${target}, but their ${wdisplay} failed them in their time of need!`, 
            "red"
        );
        return embedy;
    }
    
    if (targetProf.ignore == true) return embedy.add(
        "Divine Intervention!",
        "Dabloon Cat notices you attempt to attack his chosen, and intercepts your attack!",
        "hotpink"
    );

    const attackRoll = attackProf.rollToHit;
    const damageRoll = attackProf.rollDamage;
    var stealRoll = 4;

    embedy.add(
        `${weapon.act} Attack!`, 
        `${attacker} attacks ${target} using ${wdisplay}! They roll a ${attackRoll.total} to hit!`
    );
    
    if (attackRoll.total >= targetProf.ac) {
        embedy.add(
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
            embedy.add(
                "Slay!", 
                `${attacker} killed ${target} and stole ${await client.toDisplay('balance', stealRoll)}.`, 
                "cyan"
            );
        }
        await targetProf.save().catch(console.error);
        await attackProf.save().catch(console.error);
    } else {
        attackProf.save().catch(console.error);
        embedy.add(
            "Miss!", 
            `${target}'s Armor Class is higher than ${attackRoll.total}!`,
            "red"
        );
    }
    return embedy
}