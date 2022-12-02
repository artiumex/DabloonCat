const xp_level = [
    0,
    300,
    900,
    2700,
    6500,
    14000,
    23000,
    34000,
    48000,
    64000,
    85000,
    100000,
    120000,
    140000,
    165000,
    195000,
    225000,
    265000,
    305000,
    355000
].reverse();

module.exports = {
    attributeList: ['Prowess', 'Mettle', 'Awe', 'Judgement', 'Wyrd'],
    // classList: ['Peasant', 'Arcane', 'Trickster', 'Warrior', 'Keeper'],
    classList: [
        { name: "Peasant", desc: "Default classed. Ruled by Awe." },
        { name: "Arcane", desc: "Allows you to wield magic. Rules by Wyrd." },
        { name: "Trickster", desc: "Grants you power over trickery. Ruled by Mettle." },
        { name: "Warrior", desc: "Your immense strength allows you to fight. Ruled by Prowess." },
        { name: "Keeper", desc: "Allows you to control the forces of currency. Ruled by Judgement." },
    ],
    raceList: ['Human', 'Elf', 'Dwarf', 'Celestial'],
    weaponList: ['none', 'Wand', 'Paperclip', 'Sword', 'Wallet'],
    mod (attr) {
        return Math.floor((attr - 10) / 2)
    },
    favored (profile, modNeeded = true) {
        const vals = [profile.awe, profile.wyrd, profile.mettle, profile.prowess, profile.judgement];
        const favoredValue = vals[profile.classId];
        if (modNeeded) return this.mod(favoredValue);
        else return favoredValue;
    },
    calc_level (xp) {
        return xp_level.length - xp_level.findIndex(e => xp >= e);
    }
}