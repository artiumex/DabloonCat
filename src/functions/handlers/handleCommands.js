const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const chalk = require('chalk');

module.exports = (client) => {
    client.handleCommands = async() => {
        const commandFolders = fs.readdirSync('./src/commands');
        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`./src/commands/${folder}`).filter((file)=>file.endsWith('.js'));
            
            const { commands, commandArray } = client;
            for (const file of commandFiles) {
                const command = require(`../../commands/${folder}/${file}`);
                commands.set(command.data.name, command);
                commandArray.push(command.data.toJSON());
            }
        }

        const rest = new REST({ version: 9 }).setToken(process.env.token);
        if (client.dev) {
            try {
                console.log(chalk.cyan("Started refreshing application (/) commands."));
                
                await rest.put(Routes.applicationGuildCommands(process.env.clientId, process.env.guildId), {
                    body: client.commandArray,
                });
    
                console.log(chalk.green("Successfully reloaded application (/) commands."));
            } catch (error) {
                console.error(error);
            }
        } else {
            try {
                console.log(chalk.cyan("Started refreshing global application (/) commands."));
                
                await rest.put(Routes.applicationCommands(process.env.clientId), {
                    body: client.commandArray,
                });
                await rest.put(Routes.applicationGuildCommands(process.env.clientId, process.env.guildId), {
                    body: [],
                });
    
                console.log(chalk.green("Successfully reloaded global application (/) commands."));
            } catch (error) {
                console.error(error);
            }
        }
    }
}