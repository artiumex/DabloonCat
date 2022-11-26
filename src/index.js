require('dotenv').config();
const { token, databaseToken } = process.env;
const { connect } = require('mongoose');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

const client = new Client({ intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions ] })
client.commands = new Collection();
client.commandArray = [];
client.reactions = new Collection();

const functionsFolder = fs.readdirSync('./src/functions');
for (const folder of functionsFolder) {
    const functionFiles = fs.readdirSync(`./src/functions/${folder}`).filter((file)=>file.endsWith('.js'));
    for (const file of functionFiles) require(`./functions/${folder}/${file}`)(client);
}

client.handleEvents();
client.handleCommands();
client.login(token);
(async () => {
    await connect(databaseToken).catch(console.error);
})();