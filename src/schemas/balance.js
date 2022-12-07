const { Schema, model } = require('mongoose');
const about = require('../universal/about');
const cooldowns = require('../universal/cooldowns');

const balanceSchema = new Schema({
    _id: Schema.Types.ObjectId,
    // guildId: String,
    userId: String,
    balance: { type: Number, default: 0 },
    partyId: { type: String, default: 'none' },
    classId: { type: String, default: 'default' },
    raceId: { type: String, default: 'default' },
    prowess: { type: Number, default: 0 },
    mettle: { type: Number, default: 0 },
    awe: { type: Number, default: 0 },
    judgement: { type: Number, default: 0 },
    wyrd: { type: Number, default: 0 },
    hp: { type: Number, default: 50 },
    xp: { type: Number, default: 0 },
    weaponUseTimeout: { type: Date, default: new Date() },
    dailyUseTimeout: { type: Date, default: new Date(0) },
    ignore: { type: Boolean, default: false },
    admin: { type: Boolean, default: false },
}, {
    virtuals: {
        p: {
            get() {
                return about.mod(this.prowess) + about.racialBonus(this, "p") + about.classBonus(this, "p");
            }
        },
        m: {
            get() {
                return about.mod(this.mettle) + about.racialBonus(this, "m") + about.classBonus(this, "m");
            }
        },
        a: {
            get() {
                return about.mod(this.awe) + about.racialBonus(this, "a") + about.classBonus(this, "a");
            }
        },
        j: {
            get() {
                return about.mod(this.judgement) + about.racialBonus(this, "j") + about.classBonus(this, "pj");
            }
        },
        w: {
            get() {
                return about.mod(this.wyrd) + about.racialBonus(this, "w") + about.classBonus(this, "w");
            }
        },
        class: {
            get() {
                return about.classes.map.get(this.classId);
            }
        },
        race: {
            get() {
                return about.races.map.get(this.raceId);
            }
        },
        attributes: {
            get() {
                return about.attributes(this);
            }
        },
        rollToHit: {
            get() {
                return about.roll(this.class.weapon.rolls.to_hit, this);
            }
        },
        rollDamage: {
            get() {
                return about.roll(this.class.weapon.rolls.damage, this);
            }
        },
        ac: {
            get() {
                return 10 + this.m;
            }
        },
        hp_max: {
            get() {
                return about.roll(`${this.class.hit_dice} &m`, this).maxTotal;
            }
        },
        luck: {
            get() {
                return 5 + this.a >= 0 ? 5 + this.a : 1;
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
        level: {
            get() {
                return about.calc_level(this.xp);
            }
        },
        prof: {
            get() {
                return about.calc_prof(this.level);
            }
        },
        handle: {
            get() {
                return `Level ${this.level} ${this.race.name} ${this.class.name}`
            }
        }
    }
});

module.exports = model("Balance", balanceSchema, "balances");