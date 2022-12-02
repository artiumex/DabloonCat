module.exports = (client) => {
    client.randomNum = async(max, luck = 1, min = 1) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}