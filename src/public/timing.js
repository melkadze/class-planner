const luxon = require("luxon")
const axios = require("axios")

function convertToTime(hour, minute, isPM) {
    const timeNow = luxon.DateTime.local()
    
    //12hour -> 24hour
    if (isPM) {
        hour = Number(hour) + 12
    }
    
    let convertedTime = luxon.DateTime.fromObject({
        hour: hour,
        minutes: minute
    })
    
    //if time is in the past, make it the next day (a quirk of empty-date time assignment)
    if (Math.sign(convertedTime.diff(timeNow, 'days').values.days) === -1) {
        convertedTime = convertedTime.plus({ days: 1 })
    }
    
    return convertedTime
}

function sendPOST(url, content) {
    const xhttp = new XMLHttpRequest();
    xhttp.open('POST', url, true);
    xhttp.setRequestHeader('Content-Type', 'application/json')
    xhttp.send(content)
}

document.getElementById('periodInputButton').onclick = function () {
    const forSchedule = document.getElementById('periodInputForSchedule').value
    const period = document.getElementById('periodInputPeriod').value
    const hourStart = document.getElementById('periodInputHourStart').value
    const minuteStart = document.getElementById('periodInputMinuteStart').value
    const apmStart = document.getElementById('periodInputAPMStart').checked
    const hourEnd = document.getElementById('periodInputHourEnd').value
    const minuteEnd = document.getElementById('periodInputMinuteEnd').value
    const apmEnd = document.getElementById('periodInputAPMEnd').checked
    
    const convertedTimeStart = convertToTime(hourStart, minuteStart, apmStart)
    const convertedTimeEnd = convertToTime(hourEnd, minuteEnd, apmEnd)
    
    sendPOST("/schedule/period/upload", `{"forSchedule": "${forSchedule}", "period": "${period}", "timeStart": "${convertedTimeStart}", "timeEnd": "${convertedTimeEnd}"}`)
}

document.getElementById('scheduleRetrieveButton').onclick = function () {
    const schedule = document.getElementById('scheduleRetrieveButton').value
    
    axios.get('/schedule/NTest')
    .then (function (response) {
        console.log(response.data)
    
        for (i = 1; i < 10; i++) {
            document.getElementById(`periodDisplayPeriod${i}`).innerHTML = response.data[i].period
            document.getElementById(`periodDisplayTimeStart${i}`).innerHTML = luxon.DateTime.fromISO(response.data[i].timeStart).toFormat('h:mm a')
            document.getElementById(`periodDisplayEnd${i}`).innerHTML = luxon.DateTime.fromISO(response.data[i].timeEnd).toFormat('h:mm a')
        }
    })
    .catch(function (error) {
        console.log(`ERROR: ${error}`)
    })
    .finally(function () {
        console.log('OK')
    })
    
    sendPOST("/schedule/period/upload", `{"forSchedule": "${forSchedule}", "period": "${period}", "timeStart": "${convertedTimeStart}", "timeEnd": "${convertedTimeEnd}"}`)
}






//console.log(convertToTime(10, 30, true).toISO())


/*

const timeNow = luxon.DateTime.local()
const timeTarget = luxon.DateTime.fromObject({
    hour: 10,
    minutes: 30
})

//console.log(luxon.DateTime.local().minus({ hours: 3 }))


console.log(timeNow.toISO())
console.log(timeTarget.toISO())

console.log(Math.sign(timeNow.diff(timeTarget, 'days').values.days))
console.log(Math.sign(timeTarget.diff(timeNow, 'days').values.days))
*/