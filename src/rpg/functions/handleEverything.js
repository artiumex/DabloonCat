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
    const obj = require(`../stuff/races/${file}`);
    raceMaster.map.set(obj.id, obj);
    raceMaster.arr.push(obj);
}

const godsMaster = {
    arr: [],
    map: new Map(),
}

const godFiles = fs.readdirSync(`./src/rpg/stuff/gods`).filter((file)=>file.endsWith('.js'));

for (const file of godFiles) {
    const obj = require(`../stuff/gods/${file}`);
    godsMaster.map.set(obj.id, obj);
    godsMaster.arr.push(obj);
}

module.exports = {
    classes: classMaster,
    races: raceMaster,
    gods: godsMaster,
}