module.exports = (client) => {
    client.dev = process.env.dev == "yes" ? true : false;
}