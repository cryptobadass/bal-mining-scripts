function stampToTime(timestamp, type = '1') {
    const num = String(timestamp).length;
    if (num === 10) {
        timestamp = timestamp * 1000;
    }
    var date = new Date(timestamp),
        Y = date.getFullYear(),
        M = date.getMonth() + 1,
        D = date.getDate(),
        h = date.getHours(),
        m = date.getMinutes(),
        s = date.getSeconds();
    if (M < 10) {
        M = '0' + M;
    }
    if (D < 10) {
        D = '0' + D;
    }
    if (h < 10) {
        h = '0' + h;
    }
    if (m < 10) {
        m = '0' + m;
    }
    if (s < 10) {
        s = '0' + s;
    }
    let time;
    if (type === '1' || type === 1) {
        time = Y + '/' + M + '/' + D + ' ' + h + ':' + m + ':' + s;
    }
    if (type === '2' || type === 2) {
        time = Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s;
    }
    if (type === '3' || type === 3) {
        time = Y + '/' + M + '/' + D;
    }
    if (type === '4' || type === 4) {
        time = Y + '-' + M + '-' + D;
    }
    if (type === '5' || type === 5) {
        time = h + ':' + m + ':' + s;
    }
    if (type === '6' || type === 6) {
        time = h + ':' + m;
    }
    return time;
}

module.exports = {
    stampToTime,
};
