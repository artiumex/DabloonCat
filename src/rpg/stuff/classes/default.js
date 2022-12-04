module.exports = {
    name: "Peasant",
    id: "default",
    desc: "Default class.",
    hit_dice: "lvld4",
    weapon: {
        name: "Fists", 
        act: "Force",
        rolls: {
            to_hit: "1d20 &a",
            damage: "1d4 &p",
        },
        emoji: {
            text: ":punch:",
            id: "👊",
        }
    }
}