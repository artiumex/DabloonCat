const { EmbedBuilder } = require("@discordjs/builders");

module.exports = (client) => {
    client.embedy = async(title, description, color = "black") => {
        const output = new EmbedBuilder().setTitle(title).setDescription(description);
        switch (color) {
            case ("black"):
                output.setColor([0,0,0]);
                break;
            case ("red"):
                output.setColor([225,0,0]);
                break;
            case ("green"):
                output.setColor([0,255,0]);
                break;
            case ("cyan"):
                output.setColor([0,255,255]);
                break;
            case ("random"):
                output.setColor(await client.randomNum(16777215, 0))
                break
        }
        return output;
    }
}