const Party = require('../../schemas/party');

module.exports = (client) => {
    client.getParty = async (partyId) => {
        const storedParty = await Party.findOne({ id: partyId });

        if (!storedParty) return false;
        else return storedParty;
    }
}