module.exports = {
    name: "Trickster",
    id: "trickster",
    desc: "Grants you power over trickery.",
    hit_dice: "lvld8",
    weapon: {
        name: "Lockpick", 
        act: "Trickery",
        rolls: {
            to_hit: "1d20 + prof &m",
            damage: "1d4 &m",
        },
        emoji: {
            text: ":paperclip:",
            id: "📎",
        }
    },
    bonuses: {
        p: false,
        m: true,
        a: false,
        j: false,
        w: false,
    }
}