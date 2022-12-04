const { Schema, model } = require('mongoose');
const godsSchema = new Schema({
    _id: Schema.Types.ObjectId,
    gods: {
        type: Map,
        of: String
    },
});

module.exports = model("God", godsSchema, "gods");