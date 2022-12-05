const et = require('./handleEverything');
const God = require('../../schemas/gods');

const shuffleRaces = () => {
    return et.races.arr[Math.floor(Math.random() * (et.races.arr.length))];
}

async function db() {
    return await God.findOne({ uid: "daddy" });
}

module.exports = {
    db: db,
    list: et.gods,
    async chooseFavored() {
        const daddy = await db();
        const list = {};
        const output = [];
        for (const god of et.gods.arr) {
            const race = (shuffleRaces()).id;
            list[god.id] = race;
            output.push(`${god.name} favors ${(et.races.map.get(race)).name}`)
        }
        daddy.gods = list;
        daddy.save().catch(console.error);
        console.log(output.join('\n'));
    },
    getPronouns(god) {
        var output;
        switch (et.gods.map.get(god).pronouns) {
            case ("masculine"):
                output = { subject: "he", object: "him", possessive: "his", reflexive: "himself", };
                break;
            case ("feminine"):
                output = { subject: "she", object: "her", possessive: "her", reflexive: "herself", };
                break;
            case ("epicene"):
                output = { subject: "they", object: "them", possessive: "their", reflexive: "themself", };
                break;
            case ("neuter"):
                output = { subject: "it", object: "it", possessive: "its", reflexive: "itself", };
                break;
        }
        return output;
    },
}