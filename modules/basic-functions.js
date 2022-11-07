function setFormat(number) {
    if (number < 10) return "0" + number;
    else return number;
}

function timeZoneHandler(date) {
    const offset = date.getTimezoneOffset();
    return new Date(date.getTime() - (offset*60*1000));
}

function prettifyDate(date) {
    return date.toLocaleString('ru', {dateStyle: "short", timeStyle: "short"});
}

export { setFormat, timeZoneHandler, prettifyDate };