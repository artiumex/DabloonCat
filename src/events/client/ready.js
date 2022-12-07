var CronJob = require('cron').CronJob;
const chalk = require('chalk');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(chalk.blue(`Ready!!!!!! ${client.user.tag} is logged in and online.`));
        new CronJob(
            '0 0 8-20 * * *',
            client.shuffleGods,
            null,
            true,
            'America/Chicago',
            null,
            true
        );
    }
}