module.exports = {
    name: "Warrior",
    id: "warrior",
    desc: "Your immense strength allows you to fight",
    hit_dice: "1d10",
    weapon: {
        name: "Sword", 
        act: "Violence",
        rolls: {
            to_hit: "1d20 + prof + prowess",
            damage: "2d6",
        },
        emoji: {
            text: ":crossed_swords:",
            id: "⚔️",
        }
    }
}