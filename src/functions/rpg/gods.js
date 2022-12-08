var mysql = require('mysql');
const chalk = require('chalk');
const Gods = require('../../schemas/gods');

const { races } = require('../../rpg/functions/handleEverything');

const shuffleRaces = () => {
    return races.arr[Math.floor(Math.random() * (races.arr.length))];
}

const getPronouns = (god) => {
    var output;
    switch (god) {
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
};

module.exports = (client) => {
    client.shuffleGods = async() => {
        const map = new Map();
        const list = [];
        const output = [];
        const results = await Gods.find({});
        for (const god of results) {
            const race = (shuffleRaces()).id;
            await Gods.findOneAndUpdate({ _id: god._id }, { favored: race });
            const newgod = {
                name: god.name,
                id: god.id,
                desc: god.description,
                favored: race,
                pronouns: getPronouns(god.pronouns),
            };
            map.set(god.id, newgod);
            list.push(newgod);
            output.push(`${god.name} favors ${(races.map.get(race)).name}`);
        }
        client.godsMap = map;
        client.godsList = list;
        console.log(chalk.yellow("---"));
        console.log(chalk.magenta(output.join('\n')));
        console.log(chalk.yellow("---"));
    };
}