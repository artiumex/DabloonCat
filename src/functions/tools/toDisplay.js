const emoji = require('../../universal/emoji');

module.exports = (client) => {
    client.toDisplay = async(choice, value) => {
        var output;
        switch (choice) {
            case "balance":
                output = emoji.dabloon.text + (value || value == 0 ? ` ${value}` : '');
                break;
            case "money":
                output = emoji.dabloon.text;
                break;
            case "alert":
                output = `${emoji.alert.text} ${value} ${emoji.alert.text}`
                break;
            default:
                output = "AHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH";
                break
        }
        return output
    }
}