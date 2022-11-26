const emoji = require('../../universal/emoji');

module.exports = (client) => {
    client.toDisplay = async(choice, value) => {
        var output;
        switch (choice) {
            case "balance":
                output = emoji.dabloon.text + (value ? ` ${value}` : '');
                break;
            case "money":
                output = emoji.dabloon.text;
            default:
                output = "AHHHHHHHHHHHHHHHHHHHHHHHHHHHHHH";
                break
        }
        return output
    }
}