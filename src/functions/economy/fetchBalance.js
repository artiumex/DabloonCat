const Balance = require('../../schemas/balance'); 
const { Types } = require('mongoose');

const randAttribute = () => {
    return Math.floor(Math.random() * 13) + 8;
}

module.exports = (client) => {
    client.fetchBalance = async (userId) => {
        let storedBalance = await Balance.findOne({ userId: userId });

        if (!storedBalance) {
            storedBalance = await new Balance({
                _id: Types.ObjectId(),
                userId: userId,
                prowess: randAttribute(),
                mettle: randAttribute(),
                awe: randAttribute(),
                judgement: randAttribute(),
                wyrd: randAttribute(),
            })
            storedBalance.hp = storedBalance.hp_max;
            await storedBalance.save().then(async balance => {
                console.log(`[Balance Created] UserID: ${balance.userId}`);
            }).catch(console.error);
            return storedBalance;
        } else return storedBalance;
    }
}