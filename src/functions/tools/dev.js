module.exports = (client) => {
    client.dev = () => {
        if (process.env.dev == "yes") return true;
        else return false;
    }
}