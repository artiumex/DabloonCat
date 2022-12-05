const { Schema, model } = require('mongoose');
const godsSchema = new Schema({
    _id: Schema.Types.ObjectId,
    gods: {
        type: Map,
        of: String
    },
    share_loot: { type: Boolean, default: false },
});

module.exports = model("God", godsSchema, "gods");