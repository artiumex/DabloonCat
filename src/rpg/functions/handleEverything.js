const fs = require('fs');

const classMaster = {
    arr: [],
    map: new Map(),
}

const classFiles = fs.readdirSync('./src/rpg/stuff/classes').filter((file)=>file.endsWith('.js'));

for (const file of classFiles) {
    const classObj = require(`../stuff/classes/${file}`);
    classMaster.map.set(classObj.id, classObj);
    classMaster.arr.push(classObj);
}

const raceMaster = {
    arr: [],
    map: new Map(),
}

const raceFiles = fs.readdirSync(`./src/rpg/stuff/races`).filter((file)=>file.endsWith('.js'));

for (const file of raceFiles) {
    const raceObj = require(`../stuff/races/${file}`);
    raceMaster.map.set(raceObj.id, raceObj);
    raceMaster.arr.push(raceObj);
}

module.exports = {
    classes: classMaster,
    races: raceMaster,
}