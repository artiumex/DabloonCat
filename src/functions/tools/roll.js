const about = require('../../universal/about');

module.exports = (client) => {
    client.roll = (note, profile = false) => {
        return about.roll(note, profile);
    }
}