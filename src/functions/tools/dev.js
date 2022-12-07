const { races, classes } = require('../../rpg/functions/handleEverything');

module.exports = (client) => {
    client.dev = process.env.dev == "yes" ? true : false;
    client.rpgClasses = classes;
    client.rpgRaces = races;
}