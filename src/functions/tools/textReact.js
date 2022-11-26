const emoji = require('../../universal/emoji');

module.exports = (client) => {
    client.textReact = async(message, name) => {
        if (!Object.keys(emoji).includes(name)) return;
        else await message.react(emoji[name].id).catch(console.error);
    }
}