const et = require('./handleEverything');
const God = require('../../schemas/gods');

const shuffleRaces = () => {
    return et.races.arr[Math.floor(Math.random() * (et.races.arr.length))];
}

module.exports = {
    async db() {
        return await God.findOne({ uid: "daddy" });
    },
    list: et.gods,
    async chooseFavored() {
        const daddy = await this.db();
        const list = {};
        for (const god of et.gods.arr) {
            list[god.id] = (shuffleRaces()).id;
        }
        daddy.gods = list;
        daddy.save().catch(console.error);
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