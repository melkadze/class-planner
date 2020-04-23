const luxon = require("luxon")
const axios = require("axios")

function convertToTime(hour, minute, isPM) {
    const timeNow = luxon.DateTime.local()
    
    //12hour -> 24hour
    if (isPM && hour != 12) {
        hour = Number(hour) + 12
    }
    
    if (isPM == 0 && hour == 12) {
        hour = 0
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
        forDay: document.getElementById('courseInputDay').value,
        period: document.getElementById('courseInputPeriod').value,
        name: document.getElementById('courseInputCourse').value
    })
    .then (function (response) {
        document.getElementById('courseError').innerHTML = ''
        document.getElementById('courseSuccess').innerHTML = 'Course send OK!'
    })
    .catch(function (error) {
        document.getElementById('courseSuccess').innerHTML = ''
        document.getElementById('courseError').innerHTML = error
    })
}

document.getElementById('dayRetrieveButton').onclick = function () {
    const day = document.getElementById('dayRetrieveDay').value
    axios.get(`/day/${day}`)
    .then (function (response) {
        document.getElementById('dayGetError').innerHTML = ''
        document.getElementById('dayGetSuccess').innerHTML = 'Day get OK!!'
        
        for (i = 0; i < response.data.length; i++) {
            document.getElementById(`courseDisplayPeriod${i}`).innerHTML = response.data[i].period;
            document.getElementById(`courseDisplayCourse${i}`).innerHTML = response.data[i].name;
        }
        
        axios.get(`/day/schedule/${day}`)
        .then(function(response) {
            document.getElementById('dayGetSuccess').innerHTML += ' AND SCHEDULE name get OK!!'
            axios.get(`/schedule/${response.data}`)
            .then(function(response) {
                document.getElementById('dayGetSuccess').innerHTML += ' AND SCHEDULE get OK!!'
                for (i = 0; i < response.data.length; i++) {
                        document.getElementById(`courseDisplayTimeStart${i}`).innerHTML = response.data[i].timeStart
                        document.getElementById(`courseDisplayEnd${i}`).innerHTML = response.data[i].timeEnd
                    }
                }
            )
            .catch(function(error) {
                document.getElementById('dayGetSuccess').innerHTML = ''
                document.getElementById('dayGetError').innerHTML = error
            });
        })
        .catch(function(error) {
            document.getElementById('dayGetSuccess').innerHTML = ''
            document.getElementById('dayGetError').innerHTML = error
        });
    })
    .catch(function (error) {
        document.getElementById('dayGetSuccess').innerHTML = ''
        document.getElementById('dayGetError').innerHTML = error
    })
}

document.getElementById('dayInputButton').onclick = function () {
    axios.post(`/day/upload`, {
        day: document.getElementById('dayInputDay').value,
        schedule: document.getElementById('dayInputSchedule').value
    })
    .then (function (response) {
        document.getElementById('dayError').innerHTML = ''
        document.getElementById('daySuccess').innerHTML = 'Day send OK!'
    })
    .catch(function (error) {
        document.getElementById('daySuccess').innerHTML = ''
        document.getElementById('dayError').innerHTML = error
    })
}

document.getElementById('taskInputButton').onclick = function () {
    axios.post(`/task/upload`, {
        name: document.getElementById('taskInputTask').value,
        course: document.getElementById('taskInputCourse').value,
        dueDate: document.getElementById('taskInputDate').value,
        completed: false
    })
    .then (function (response) {
        document.getElementById('taskError').innerHTML = ''
        document.getElementById('taskSuccess').innerHTML = 'Task send OK!'
    })
    .catch(function (error) {
        document.getElementById('taskSuccess').innerHTML = ''
        document.getElementById('taskError').innerHTML = error
    })
}

document.getElementById('eventInputButton').onclick = function () {
    axios.post(`/event/upload`, {
        name: document.getElementById('eventInputEvent').value,
        course: document.getElementById('eventInputCourse').value,
        dueDate: document.getElementById('eventInputDate').value
    })
    .then (function (response) {
        document.getElementById('eventError').innerHTML = ''
        document.getElementById('eventSuccess').innerHTML = 'Event send OK!'
    })
    .catch(function (error) {
        document.getElementById('eventSuccess').innerHTML = ''
        document.getElementById('eventError').innerHTML = error
    })
}

function initDatePickers() {
    let timeNow = luxon.DateTime.local()
    let timeNowFormatted = timeNow.toFormat('yyyy-LL-dd')
    
    document.getElementById('taskInputDate').value = timeNowFormatted
    document.getElementById('eventInputDate').value = timeNowFormatted
    document.getElementById('taskRetrieveDay').value = timeNowFormatted
    document.getElementById('eventRetrieveDay').value = timeNowFormatted
    document.getElementById('taskInputDate').min = timeNowFormatted
    document.getElementById('eventInputDate').min = timeNowFormatted
}

initDatePickers()