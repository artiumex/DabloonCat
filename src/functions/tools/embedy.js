const { EmbedBuilder } = require("@discordjs/builders");

module.exports = (client) => {
    client.embedy = class Embedy {
        constructor() {
          this.embeds = [];
        }
    
        get list() {
          return this.embeds;
        }
    
        add(title, description, color, fields, footer) {
            const output = new EmbedBuilder();
            if (title) output.setTitle(title);
            if(description) output.setDescription(description);
            switch (color) {
                case ("red"):
                    output.setColor([225,0,0]);
                    break;
                case ("green"):
                    output.setColor([0,255,0]);
                    break;
                case ("blue"):
                    output.setColor([0,0,255]);
                    break;
                case ("cyan"):
                    output.setColor([0,255,255]);
                    break;
                case ("yellow"):
                    output.setColor([255,255,0]);
                    break;
                case ("magenta"):
                    output.setColor([255,0,255]);
                    break;
                case ("random"):
                    output.setColor(Math.floor(Math.random() * (16777215)))
                    break
                case ("white"):
                    output.setColor([255,255,255]);
                    break;
                case("hotpink"):
                    output.setColor([255,105,180]);
                    break;
                default:
                    output.setColor([0,0,0]);
                    break;
            }
            if (fields) output.addFields(fields);
            if (footer) output.setTimestamp().setFooter({
                text: client.user.tag,
                iconURL: client.user.displayAvatarURL()
            });
            this.embeds.push(output);
            return this;
        }
      };
}