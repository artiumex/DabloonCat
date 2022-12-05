const { DiceRoll } = require('@dice-roller/rpg-dice-roller');

const xp_level = require('../rpg/configs/levels.json');
const prof_adv = require('../rpg/configs/profs.json');
const { classes, races } = require('../rpg/functions/handleEverything');

module.exports = {
    classes: classes,
    races: races,
    attributes(profile) {
        const list = [
            { name: "Prowess", id:"p", mid: "prowess" },
            { name: "Mettle", id:"m", mid: "mettle" },
            { name: "Awe", id:"a", mid: "awe" },
            { name: "Judgement", id:"j", mid: "judgement" },
            { name: "Wyrd", id:"w", mid: "wyrd" },
        ];
        const output = {
            list: list,
            arr: [],
            map:  new Map(),
            fields: [],
        };
        for (const a of list) {
            const attr = {
                raw: a,
                name: a.name, 
                value: profile[a.mid], 
                mod: profile[a.id],
            }
            attr.display = `${attr.value} (${attr.mod >= 0 ? `+${attr.mod}` : `-${Math.abs(attr.mod)}`})`;
            output.fields.push({ 
                name: attr.name, 
                value: attr.display,
            });
            output.arr.push(attr);
            output.map.set(a.id, attr);
        }
        return output;
    },
    parseNote(profile, note) {
        const addminus = (a) => {
            return a >= 0 ? `+ ${a}` : `- ${Math.abs(a)}` 
        }
        const output = note
        .replace('prof', profile.prof.toString())
        .replace('lvl', profile.level.toString())
        .replace('&p', addminus(profile.p))
        .replace('&m', addminus(profile.m))
        .replace('&a', addminus(profile.a))
        .replace('&j', addminus(profile.j))
        .replace('&w', addminus(profile.w));
        return output;
    },
    roll (note, profile) {
        return new DiceRoll(profile ? this.parseNote(profile, note) : note);
    },
    racialBonus(profile, attribute) {
        const output = profile.race.bonuses[attribute];
        return output;
    },
    mod(attr) {
        return Math.floor((attr - 10) / 2);
    },
    calc_level (xp) {
        return xp_level.length - xp_level.findIndex(e => xp >= e);
    },
    calc_prof (lvl) {
        return prof_adv.length - prof_adv.findIndex(e => lvl >= e);
    }
}