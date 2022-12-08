const { Schema, model } = require('mongoose');
const schema = new Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    id: String,
    description: String,
    favored: { type: String, default: "default" },
    pronouns: String,
});

module.exports = model("God", schema, "gods");