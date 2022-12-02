const { Schema, model } = require('mongoose');
const about = require('../universal/about');
const cooldowns = require('../universal/cooldowns');
const { classList, raceList, weaponList } = about;
// Class
// 0=Peasant, 1=Arcane, 2=Trickster, 3=Warrior, 4=Keeper

// Race
// 0=Human, 1=Elf, 2=Dwarf, 3=Celestial

// Weapon
// 0=none, 1=wand, 2=paperclip, 3=sword, 4=wallet

// Buffs and Inventory
// 0 = none
// 10^n
// 1 = shield, 2 = prowess, 3 = mettle, 4 = awe, 5 = judgement, 6 = wyrd, 7 = health

const balanceSchema = new Schema({
    _id: Schema.Types.ObjectId,
    guildId: String,
    userId: String,
    balance: { type: Number, default: 0 },
    classId: { type: Number, default: 0, min: 0, max: classList.length-1 },
    raceId: { type: Number, default: 0, min: 0, max: raceList.length-1 },
    weaponId: { type: Number, default: 0, min: 0, max: weaponList.length-1 },
    prowess: { type: Number, default: 0 },
    mettle: { type: Number, default: 0 },
    awe: { type: Number, default: 0 },
    judgement: { type: Number, default: 0 },
    wyrd: { type: Number, default: 0 },
    hp: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    weaponUseTimeout: { type: Date, default: new Date() },
    dailyUseTimeout: { type: Date, default: new Date() },
    // buff: { type: Number, default: 0 },
    // inventory: { type: Number, default: 0 },
}, {
    virtuals: {
        class: {
            get() {
                return classList[this.classId].name;
            },
            set(v) {
                this.classId = v;
            }
        },
        race: {
            get() {
                return raceList[this.raceId];
            },
            set(v) {
                this.raceId = v;
            }
        },
        weapon: {
            get() {
                return weaponList[this.weaponId];
            },
            set(v) {
                this.weaponId = v;
            }
        },
        ac: {
            get() {
                return 10 + about.mod(this.prowess);
            }
        },
        luck: {
            get() {
                return 5 + about.mod(this.awe) >= 0 ? 5 + about.mod(this.awe) : 1;
            }
        },
        hp_max: {
            get() {
                return 5 + (8 * (this.level - 1)) + about.mod(this.mettle);
            },
        },
        favored_mod: {
            get() {
                return about.favored(this, true);
            }
        },
        dailyUse: {
            get() {
                return cooldowns.isReady(this.dailyUseTimeout, cooldowns.daily);
            }
        },
        weaponUse: {
            get() {
                return cooldowns.isReady(this.weaponUseTimeout, cooldowns.weapon);
            }
        },
        attributes: {
            get() {
                return [
                    { name: 'Prowess', value: this.prowess, mod: about.mod(this.prowess) },
                    { name: 'Mettle', value: this.mettle, mod: about.mod(this.mettle) },
                    { name: 'Awe', value: this.awe, mod: about.mod(this.awe) },
                    { name: 'Judgement', value: this.judgement, mod: about.mod(this.judgement) },
                    { name: 'Wyrd', value: this.wyrd, mod: about.mod(this.wyrd) },
                ]
            }
        },
        level: {
            get() {
                return about.calc_level(this.xp);
            }
        },
        handle: {
            get() {
                return `Level ${this.level} ${this.race} ${this.class}`
            }
        }
    }
});

module.exports = model("Balance", balanceSchema, "balances");