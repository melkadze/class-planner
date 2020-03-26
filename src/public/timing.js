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
        console.log(response.data)
        
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
                console.log(error)
            });
        })
        .catch(function(error) {
            document.getElementById('dayGetSuccess').innerHTML = ''
            document.getElementById('dayGetError').innerHTML = error
            console.log(error)
        });
    })
    .catch(function (error) {
        document.getElementById('dayGetSuccess').innerHTML = ''
        document.getElementById('dayGetError').innerHTML = error
        console.log(error)
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

function isInteger(num) {
    return (!(num % 1))
}

function countdownFormat(input) {
    //making these strings still allows numerical manipulation,
    //but allows us to return 00 in place of 0 later
    let inputRounded = JSON.stringify(Math.ceil(input))
    let hoursInInput = '0'
    let minutesInInput = '0'
    
    while (inputRounded > 3599) {
        inputRounded = inputRounded - 3600
        hoursInInput++
    }
    
    while (inputRounded > 59) {
        inputRounded = inputRounded - 60
        minutesInInput++
    }
    
    //these all add a leading zero if necessary
    if (inputRounded < 10) {
        inputRounded = `0${inputRounded}`
    }
    
    if (minutesInInput < 10) {
        minutesInInput = `0${minutesInInput}`
    }
    
    if (hoursInInput < 10) {
        hoursInInput = `0${hoursInInput}`
    }
    
    //inputRounded is now the amount of seconds in input
    if (hoursInInput != 0) {
        return `${hoursInInput}:${minutesInInput}:${inputRounded}`
    } else if (minutesInInput != 0) {
        return `${minutesInInput}:${inputRounded}`
    } else {
        return `${inputRounded}`
    }
}

function updateTimer() {
    let timeNow = luxon.DateTime.local()
    let timeNowFormatted = timeNow.toFormat('h:mm:ss a')
    let targetTime = convertToTime(7, 0, true)
    let timeUntilTarget = targetTime.diff(timeNow, 'seconds').values.seconds
    let timeUntilTargetFormatted = countdownFormat(timeUntilTarget)
    document.getElementById('currentTime').innerHTML = `Current time: ${timeNowFormatted}`
    document.getElementById('timeUntil').innerHTML = `Time until 7pm: ${timeUntilTargetFormatted}`
}

updateTimer() //runs the timer before the 1000ms delay so its ready at page load
setInterval(updateTimer, 1000)