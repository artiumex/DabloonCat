const about = require('../../universal/about');

module.exports = (client) => {
    client.roll = async(profile, note) => {
        return about.roll(note, profile);
    }
}