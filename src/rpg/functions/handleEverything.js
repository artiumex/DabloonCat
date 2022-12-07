const chalk = require('chalk');
const fs = require('fs');

const out = (master) => {
    const size = `Successfully loaded ${master.arr.length} ${master.type}: `;
    const list = master.arr.map(e=>e.name).join(', ');
    console.log(chalk.blue(size)+chalk.yellow(`[ ${list} ]`));
}

const classMaster = {
    type: "Classes",
    arr: [],
    map: new Map(),
}

const classFiles = fs.readdirSync('./src/rpg/stuff/classes').filter((file)=>file.endsWith('.js'));

for (const file of classFiles) {
    const classObj = require(`../stuff/classes/${file}`);
    classMaster.map.set(classObj.id, classObj);
    classMaster.arr.push(classObj);
}
out(classMaster);

const raceMaster = {
    type: "Races",
    arr: [],
    map: new Map(),
}

const raceFiles = fs.readdirSync(`./src/rpg/stuff/races`).filter((file)=>file.endsWith('.js'));

for (const file of raceFiles) {
    const obj = require(`../stuff/races/${file}`);
    raceMaster.map.set(obj.id, obj);
    raceMaster.arr.push(obj);
}
out(raceMaster);

const godsMaster = {
    type: "Gods",
    arr: [],
    map: new Map(),
}

module.exports = {
    classes: classMaster,
    races: raceMaster,
}