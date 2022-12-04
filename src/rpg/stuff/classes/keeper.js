module.exports = {
    name: "Keeper",
    id: "keeper",
    desc: "Allows you to control the forces of currency",
    hit_dice: "lvld8",
    weapon: {
        name: "Wallet of Nefarious Acts", 
        act: "Gaslight",
        rolls: {
            to_hit: "1d20 + prof &j",
            damage: "1d4 &j",
        },
        emoji: {
            text: ":moneybag:",
            id: "💰",
        }
    }
}