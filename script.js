import { prettifyDate, setFormat, timeZoneHandler } from './modules/basic-functions.js';

const datePickerInit = document.querySelector('.date-picker--start');
const timePickerInit = document.querySelector('.time-picker--start');
const timeToAdd = document.querySelector('.time-to-add');
const buttonPlus = document.querySelector('.button--add');
const buttonMinus = document.querySelector('.button--substr');
const history = document.querySelector('.history-list');

function OperationDate(date) {
    this.date = date;
    this.addTimeValid = true;
    this.historyArr = [];
}

OperationDate.prototype.setDate = function(date) {
    this.date = date;
}

OperationDate.prototype.setTime = function(date, time) {
    if (time === null) {
        this.setDate(date);
    } else {
        let tempDate = (date.getTime() - (date.getHours()*3600000 + date.getMinutes()*60000 + date.getSeconds()*1000)) + time;
        this.date = new Date(tempDate);
    }
}

OperationDate.prototype.setDateField = function(dateField, date, time) {
    this.setTime(date, time);
    dateField.value = timeZoneHandler(date).toISOString().split('T')[0];
}

OperationDate.prototype.setTimeField = function(timeField, date, time) {
    this.setTime(date, time)
    timeField.value = "" + setFormat(this.date.getHours()) + setFormat(this.date.getMinutes());
}

OperationDate.prototype.setInitFields = function(dateField, timeField, date) {
    this.setDateField(dateField, date, null);
    this.setTimeField(timeField, date, null);
}

OperationDate.prototype.getNewTime = function(timeInMs, type) {
    if (type) {
        return new Date(this.date.getTime() + timeInMs);
    } else {
        return new Date(this.date.getTime() - timeInMs);
    }
}

let currentDate = new Date();
let OpDate = new OperationDate(currentDate);
OpDate.setInitFields(datePickerInit, timePickerInit, currentDate);

OperationDate.prototype.addToHistory = function(before, after, time) {
    let newHistoryrecord = {
        before,
        after,
        time,
    };
    this.historyArr.push(newHistoryrecord);
    return newHistoryrecord;
}

function writeRecord(before, after, time, historyRecord) {
    before.innerHTML = prettifyDate(historyRecord.before);
    after.innerHTML = prettifyDate(historyRecord.after);
    time.innerHTML = getFormatTime(historyRecord.time);
}

function createHistoryElem(historyRecord) {
    const historyLine = document.createElement('li');
    historyLine.className = 'history-list__elem';
    const beforeAdd = document.createElement('p');
    beforeAdd.className = 'history-list__elem--before';
    const addTime = document.createElement('p');
    addTime.className = 'history-list__elem--add-time';
    const afterAdd = document.createElement('p');
    afterAdd.className = 'history-list__elem--after';
    historyLine.append(beforeAdd, addTime, afterAdd);
    history.append(historyLine);
    writeRecord(beforeAdd, afterAdd, addTime, historyRecord);
}

function getFormatTime(timeInMs) {
    timeInMs = (timeInMs - timeInMs%1000)/1000;
    let sec = timeInMs%60;
    timeInMs = (timeInMs - sec)/60;
    let min = timeInMs%60;
    let hr = (timeInMs - min)/60;
    return setFormat(hr) + ':' + setFormat(min);
}

function timeInputValidation(time) {
    let hr = Math.floor(time/100);
    let min = time%100;
    if (hr > 24 || min > 60) return false;
    else return true;
}



datePickerInit.addEventListener("change", () => {
    let msInputTime = Math.floor(timePickerInit.value/100)*3600000 + (timePickerInit.value%100)*60000;
    OpDate.setDateField(datePickerInit, new Date(datePickerInit.value), msInputTime);
});

timePickerInit.addEventListener("change", () => {
    timePickerInit.setCustomValidity("");
    if (!timeInputValidation(timePickerInit.value)) {
        timePickerInit.setCustomValidity("You must input valid time in following format: HHMM (e.g. 0715)");
        timePickerInit.reportValidity();
    } else {
        timePickerInit.setCustomValidity("");
        let msInputTime = Math.floor(timePickerInit.value/100)*3600000 + (timePickerInit.value%100)*60000;
        OpDate.setTimeField(timePickerInit, OpDate.date, msInputTime);
    }
});

timeToAdd.addEventListener("change", () => {
    timePickerInit.setCustomValidity("");
    if (timeToAdd.value%100 > 60) {
        timeToAdd.setCustomValidity("You must input valid time in following format: HHMM (e.g. 0715)");
        timeToAdd.reportValidity();
        OpDate.addTimeValid = false;
    } else {
        timeToAdd.setCustomValidity("");
        OpDate.addTimeValid = true;
    }
});

buttonPlus.addEventListener("click", () => {
    if (OpDate.addTimeValid) {
        let msAddTime = Math.floor(timeToAdd.value/100)*3600000 + (timeToAdd.value%100)*60000;
        let newTime = OpDate.getNewTime(msAddTime, true);
        let historyRecord = OpDate.addToHistory(OpDate.date, newTime, msAddTime);
        createHistoryElem(historyRecord);
    }
});

buttonMinus.addEventListener("click", () => {
    if (OpDate.addTimeValid) {
        let msAddTime = Math.floor(timeToAdd.value/100)*3600000 + (timeToAdd.value%100)*60000;
        let newTime = OpDate.getNewTime(msAddTime, false);
        let historyRecord = OpDate.addToHistory(OpDate.date, newTime, msAddTime);
        createHistoryElem(historyRecord);
    }
});