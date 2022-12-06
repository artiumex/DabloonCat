module.exports = {
    roles: {
        leader: {
            display: "Leader",
            desc: "The Leader"
        },
        tact: {
            display: "Tactician",
            desc: "The Tactician"
        },
        healer: {
            display: "Healer",
            desc: "The Healer"
        },
        member: {
            display: "Fighter",
            desc: "The Fighter"
        }
    },
    rolesIds(slice = true) {
        if (slice) return (Object.keys(this.roles)).slice(0,-1)
        return Object.keys(this.roles)
    },
}