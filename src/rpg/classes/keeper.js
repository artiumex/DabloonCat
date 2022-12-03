module.exports = {
    name: "Keeper",
    id: "keeper",
    desc: "Allows you to control the forces of currency",
    hit_dice: "1d8",
    weapon: {
        name: "Wallet of Nefarious Acts", 
        act: "Gaslight",
        rolls: {
            to_hit: "1d20 + prof + judgement",
            damage: "1d4 + judgement",
        },
        emoji: {
            text: ":moneybag:",
            id: "💰",
        }
    }
}