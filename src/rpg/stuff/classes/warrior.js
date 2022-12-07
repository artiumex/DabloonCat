module.exports = {
    name: "Warrior",
    id: "warrior",
    desc: "Your immense strength allows you to fight",
    hit_dice: "lvld10",
    weapon: {
        name: "Sword", 
        act: "Violence",
        rolls: {
            to_hit: "1d20 + prof &p",
            damage: "2d6",
        },
        emoji: {
            text: ":crossed_swords:",
            id: "⚔️",
        }
    },
    bonuses: {
        p: true,
        m: false,
        a: false,
        j: false,
        w: false,
    }
}