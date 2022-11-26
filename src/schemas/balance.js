const { Schema, model } = require('mongoose');
const about = require('../universal/about');
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
                return classList[this.classId];
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
        hp_max: {
            get() {
                return 8 + about.favored(this);
            },
        },
        hp_update: {
            set(v) {
                if (this.hp - v < 0) this.hp = 0;
                else this.hp -= v;
            }
        },
        favored_mod: {
            get() {
                return about.favored(this, true);
            }
        },
        dailyUse: {
            get() {
                return this.dailyUseTimeout + 86400000 > new Date()
            }
        },
        weaponUse: {
            get() {
                return this.dailyUseTimeout + 60000 > new Date()
            }
        }
    }
});

module.exports = model("Balance", balanceSchema, "balances");