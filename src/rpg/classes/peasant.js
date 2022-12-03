module.exports = {
    name: "Peasant",
    id: "default",
    desc: "Default class.",
    hit_dice: "1d4",
    weapon: {
        name: "Fists", 
        act: "Force",
        rolls: {
            to_hit: "1d20 + awe",
            damage: "1d4 + prowess",
        },
        emoji: {
            text: ":punch:",
            id: "👊",
        }
    }
}