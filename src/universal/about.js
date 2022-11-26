module.exports = {
    classList: ['Peasant', 'Arcane', 'Trickster', 'Warrior', 'Keeper'],
    raceList: ['Human', 'Elf', 'Dwarf', 'Celestial'],
    weaponList: ['none', 'Wand', 'Paperclip', 'Wallet'],
    mod (attr) {
        return Math.floor((attr - 10) / 2)
    },
    favored (profile, modNeeded = true) {
        const vals = [profile.awe, profile.wyrd, profile.mettle, profile.prowess, profile.judgement];
        const favoredValue = vals[profile.classId];
        if (modNeeded) return this.mod(favoredValue);
        else return favoredValue;
    },
}