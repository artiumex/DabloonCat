const emoji = require('../../universal/emoji');

module.exports = (client) => {
    client.toDisplay = (choice, value) => {
        var output;
        switch (choice) {
            case "balance":
                output = `${value || value == 0 ? `**${value}**` : ':eyes:'} ${emoji.dabloon.text}`;
                break;
            case "money":
                output = emoji.dabloon.text;
                break;
            case "alert":
                output = `${emoji.alert.text} **${value}** ${emoji.alert.text}`
                break;
            case "cat":
                output = `${emoji.cat.text}  **${value}**`
                break;
            default:
                output = "AHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH";
                break;
        }
        return output
    }
}