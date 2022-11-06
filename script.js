let datePickerStart = document.querySelector('.date-picker--start');
let timePickerStart = document.querySelector('.time-picker--start');
let timeToAdd = document.querySelector('.time-to-add');
const buttonAdd = document.querySelector('.button--add');
const buttonSubstr = document.querySelector('.button--substr');

const currentDate = new Date();

datePickerStart.valueAsDate = currentDate;
timePickerStart.value = "" + ((currentDate.getHours() < 10) ? "0" + currentDate.getHours() : currentDate.getHours()) + ((currentDate.getMinutes() < 10) ? "0" + currentDate.getMinutes() : currentDate.getMinutes());
console.log(currentDate.getHours());

let inputDate,
    inputTime,
    inputTimeToAdd,
    msTimeToAdd;

let inputDateTime = new Date(datePickerStart.value);
inputDateTime.setHours(Math.floor(timePickerStart.value/100));
inputDateTime.setMinutes(timePickerStart.value%100);

datePickerStart.addEventListener("change", () => {
    inputDate = datePickerStart.value;
    inputDateTime = new Date(inputDate);
})

timePickerStart.oninput = function() {
    timePickerStart.setCustomValidity("");
}

timePickerStart.addEventListener("change", () => {
    timePickerStart.setCustomValidity("");
    if (!checkTimeValidity(timePickerStart.value)) {
        timePickerStart.setCustomValidity("You must input valid time in following format: HHMM (e.g. 0715)");
        timePickerStart.reportValidity();
    } else {
        timePickerStart.setCustomValidity("");
        inputTime = timePickerStart.value;
        inputDateTime.setHours(Math.floor(inputTime/100));
        inputDateTime.setMinutes(inputTime%100);
        console.log(inputDateTime);
    }
})

timeToAdd.addEventListener("change", () => {
    if (timeToAdd.value && !checkTimeValidity(timeToAdd.value)) {
        timeToAdd.setCustomValidity("You must input valid time in following format: HHMM (e.g. 0715)");
        timeToAdd.reportValidity();
    } else {
        timeToAdd.setCustomValidity("");
        inputTimeToAdd = timeToAdd.value;
        msTimeToAdd = (Math.floor(timeToAdd.value/100)*60 + timeToAdd.value%100)*60000;
    }
})

function checkTimeValidity(time) {
    if (Math.floor(time/100) > 24 || time%100 > 60) return false;
    else return true;
}

function setTime(time, operation) {
    if (operation) {
        inputDateTime = new Date(inputDateTime.getTime() + msTimeToAdd);
    } else {
        inputDateTime = new Date(inputDateTime.getTime() - msTimeToAdd);
    }
}

function showTime(dateAndTime) {
    document.querySelector('.show-time').textContent = dateAndTime;
}

buttonAdd.addEventListener("click", () => {
    console.log(inputDateTime.getTime());
    console.log(inputTimeToAdd);
    console.log(msTimeToAdd);
    setTime(msTimeToAdd, true);
    showTime(inputDateTime);
})

buttonSubstr.addEventListener("click", () => {
    setTime(inputTimeToAdd, false);
    showTime(inputDateTime);
})