module.exports = {
    name: "Arcane",
    id: "arcane",
    desc: "Allows you to wield magic",
    hit_dice: "lvld6",
    weapon: {
        name: "Wand", 
        act: "Magic",
        rolls: {
            to_hit: "1d20 + prof &w",
            damage: "1d10",
        },
        emoji: {
            text: ":magic_wand:",
            id: "🪄",
        }
    },
    bonuses: {
        p: false,
        m: false,
        a: false,
        j: false,
        w: true,
    }
}