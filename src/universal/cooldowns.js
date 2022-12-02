const hoursInMs = 60 * 60 * 1000;

module.exports = {
    weapon: hoursInMs / 4,
    weaponParse(profile) {
        return this.parseReadable(profile.weaponUseCooldown, this.weapon);
    },
    daily: 24 * hoursInMs,
    dailyParse(profile) {
        return this.parseReadable(profile.dailyUseCooldown, this.daily);
    },
    isReady (input, compare, needData = false) {
        const now = Date.parse(new Date());
        const inputMs = Date.parse(new Date(input));
        const test = inputMs + compare <= now;
        if (needData) return {
            test: test,
            now: now,
            target: inputMs + compare,
        };
        else return test
    },
    parseReadable(input, compare) {
        const { test, now, target } = this.isReady(input, compare, true);
        if (test) return `*NOW*`

        var x = Math.floor((target - now) / 1000);
        var seconds, minutes, hours, days;
        const output = [];

        seconds = Math.floor(x % 60);
        if (seconds > 0) output.push(seconds + ' seconds');
        x /= 60
        minutes = Math.floor(x % 60)
        if (minutes > 0) output.push(minutes + ' minutes');
        x /= 60
        hours = Math.floor(x % 24)
        if (hours > 0) output.push(hours + ' hours');
        x /= 24
        days = Math.floor(x)
        if (days > 0) output.push(days + ' days');

        return `Ready in ${output.reverse().join(', ')}`;
    }
}