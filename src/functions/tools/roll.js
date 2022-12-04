const about = require('../../universal/about');

module.exports = (client) => {
    client.roll = (profile, note) => {
        return about.roll(note, profile);
    }
}