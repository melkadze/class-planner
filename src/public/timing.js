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

function truncateTime(time) {
    return luxon.DateTime.fromISO(time).toFormat('h:mm a')
}

function truncatedTimeToISO(time) {
    
    let apm = time.split(' ')[1]
    let hour = time.split(':')[0]
    let minute = time.split(':')[1].split(' ')[0]
    
    if (apm == 'PM') {
        hour = Number(hour) + 12
    }
    
    return luxon.DateTime.fromObject({
        hour: hour,
        minutes: minute
    })
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
    
    const convertedTimeStart = truncateTime(convertToTime(hourStart, minuteStart, apmStart))
    const convertedTimeEnd = truncateTime(convertToTime(hourEnd, minuteEnd, apmEnd))
    
    axios.post(`/schedule/period/upload`, {
        forSchedule: forSchedule,
        period: period,
        timeStart: convertedTimeStart,
        timeEnd: convertedTimeEnd
    })
    .then (function (response) {
        document.getElementById('periodError').innerHTML = ''
        document.getElementById('periodSuccess').innerHTML = 'Period send OK!'
    })
    .catch(function (error) {
        document.getElementById('periodSuccess').innerHTML = ''
        document.getElementById('periodError').innerHTML = error
    })
}

document.getElementById('scheduleRetrieveButton').onclick = function () {
    const schedule = document.getElementById('scheduleRetrieveSchedule').value
    
    axios.get(`/schedule/${schedule}`)
    .then (function (response) {
        console.log(response.data)
        
        document.getElementById('scheduleGetError').innerHTML = ''
        document.getElementById('scheduleGetSuccess').innerHTML = 'Schedule get OK!'
    
        for (i = 0; i < response.data.length; i++) {
            document.getElementById(`periodDisplayPeriod${i}`).innerHTML = response.data[i].period
            document.getElementById(`periodDisplayTimeStart${i}`).innerHTML = response.data[i].timeStart
            document.getElementById(`periodDisplayEnd${i}`).innerHTML = response.data[i].timeEnd
        }
    })
    .catch(function (error) {
        document.getElementById('scheduleGetSuccess').innerHTML = ''
        document.getElementById('scheduleGetError').innerHTML = error
        console.log(error)
    })
}

document.getElementById('scheduleInputButton').onclick = function () {
    axios.post(`/schedule/upload`, {
        name: document.getElementById('scheduleInputSchedule').value
    })
    .then (function (response) {
        document.getElementById('scheduleError').innerHTML = ''
        document.getElementById('scheduleSuccess').innerHTML = 'Schedule send OK!'
    })
    .catch(function (error) {
        document.getElementById('scheduleSuccess').innerHTML = ''
        document.getElementById('scheduleError').innerHTML = error
    })
}

document.getElementById('courseInputButton').onclick = function () {
    axios.post(`/course/upload`, {
        forSchedule: document.getElementById('courseInputSchedule').value,
        period: document.getElementById('courseInputPeriod').value,
        name: document.getElementById('').value
    })
    .then (function (response) {
        document.getElementById('courseError').innerHTML = ''
        document.getElementById('courseSuccess').innerHTML = 'course send OK!'
    })
    .catch(function (error) {
        document.getElementById('courseSuccess').innerHTML = ''
        document.getElementById('courseError').innerHTML = error
    })
}