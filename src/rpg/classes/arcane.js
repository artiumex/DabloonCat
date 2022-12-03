module.exports = {
    name: "Arcane",
    id: "arcane",
    desc: "Allows you to wield magic",
    hit_dice: "1d6",
    weapon: {
        name: "Wand", 
        act: "Magic",
        rolls: {
            to_hit: "1d20 + prof + wyrd",
            damage: "1d10",
        },
        emoji: {
            text: ":magic_wand:",
            id: "🪄",
        }
    }
}