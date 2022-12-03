module.exports = {
    name: "Trickster",
    id: "trickster",
    desc: "Grants you power over trickery.",
    hit_dice: "1d8",
    weapon: {
        name: "Lockpick", 
        act: "Trickery",
        rolls: {
            to_hit: "1d20 + prof + mettle",
            damage: "1d4 + mettle",
        },
        emoji: {
            text: ":paperclip:",
            id: "📎",
        }
    }
}