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

function truncatedTimeToDT(time) {
    
    let apm = time.split(' ')[1]
    let hour = time.split(':')[0]
    let minute = time.split(':')[1].split(' ')[0]
    
    let isPM
    
    if (apm == 'PM') {
        isPM = true
    } else {
        isPM = false
    }
    
    
    return convertToTime(hour, minute, isPM)
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

function getDayOfWeek(offset) {
    let result = (luxon.DateTime.local().weekday - 1)
    
    if (offset) {
        result = result + offset
        result = result % 7
    }
    
    return result
}

async function timeOfNextPeriod() {
    try {
        const scheduleInfo = await getScheduleInfo(await getScheduleName())
        const currentTime = luxon.DateTime.local()
        let nextTime
        
        for (i = 0; i < scheduleInfo.length; i++) {
            if (Math.sign(currentTime.diff(truncatedTimeToDT(scheduleInfo[i].timeEnd)).values.milliseconds) == 1) {
                continue
            }
            
            if (Math.sign(currentTime.diff(truncatedTimeToDT(scheduleInfo[i].timeStart)).values.milliseconds) == -1) {
                nextTime = 0
                break
            } else {
                nextTime = scheduleInfo[i].timeEnd
                break
            }
        }
        return nextTime
    } catch (error) {
        console.log(error)
        document.getElementById('timeUntil').innerHTML = `No further classes for today.`
    }
}

async function timeOfNextPeriodStart() {
    try {
        const scheduleInfo = await getScheduleInfo(await getScheduleName())
        const currentTime = luxon.DateTime.local()
        let nextTime
        
        for (i = 0; i < scheduleInfo.length; i++) {
            
            if (Math.sign(currentTime.diff(truncatedTimeToDT(scheduleInfo[i].timeEnd)).values.milliseconds) == 1) {
                continue
            } else {
                nextTime = await scheduleInfo[i].timeStart
                break //new
            }
        }
        return nextTime
    } catch (error) {
        console.log(error)
        document.getElementById('timeUntil').innerHTML = `No further classes for today.`
    }
}

function getDayInfo() {
    let offset = 0
    
    return axios.get(`/day/${getDayOfWeek(offset)}`, {timeout: 1000})
    .then (function (response) {
        return response.data
    })
    .catch(function (error) {
        console.log(error)
        document.getElementById('timeUntil').innerHTML = `No further classes for today.`
    })
}

function getScheduleName() {
    let offset = 0
            
    return axios.get(`/day/schedule/${getDayOfWeek(offset)}`, {timeout: 1000})
    .then (function (response) {
        return response.data
    })
    .catch(function (error) {
        console.log(error)
        document.getElementById('timeUntil').innerHTML = `No further classes for today.`
    })
}

function getScheduleInfo(scheduleName) {
    return axios.get(`/schedule/${scheduleName}`, {timeout: 1000})
    .then(async function(response) {
        return response.data
    })
    .catch(function (error) {
        document.getElementById('timeUntil').innerHTML = `No further classes for today.`
    })
}

async function getCurrentPeriod() {
    const scheduleInfo = await getScheduleInfo(await getScheduleName())
    const currentTime = luxon.DateTime.local()
    let currentPeriod
    
    for (i = 0; i < scheduleInfo.length; i++) {
        if (Math.sign(currentTime.diff(truncatedTimeToDT(scheduleInfo[i].timeEnd)).values.milliseconds) === 1) {
            continue
        }
        currentPeriod = await scheduleInfo[i].period
        return currentPeriod
    }
}

async function getCurrentCourse() {
    const currentPeriod = await getCurrentPeriod()
    const dayInfo = await getDayInfo()
    let currentCourse
    
    for (i = 0; i < dayInfo.length; i++) {
        if (dayInfo[i].period == currentPeriod) {
            currentCourse = await dayInfo[i].name
            return currentCourse
        } else {
            continue
        }
    }
}

async function updateTimer() {
    let timeNow = luxon.DateTime.local()
    let timeNowFormatted = timeNow.toFormat('h:mm:ss a')
    
    let targetReply = await timeOfNextPeriod()
    
    if (await targetReply == 0) {
        let targetReplyNext = await timeOfNextPeriodStart()
        let timeNext = await truncatedTimeToDT(targetReplyNext)
        let timeUntilNext = await timeNext.diff(timeNow, 'seconds').values.seconds
        timeUntilNextFormatted = countdownFormat(timeUntilNext)
        document.getElementById('timeUntil').innerHTML = `Period ${await getCurrentPeriod()} ${await getCurrentCourse()} starts in: ${timeUntilNextFormatted}`
    } else if (!targetReply) {
        document.getElementById('timeUntil').innerHTML = `No further classes for today.`
    } else {
        let targetTime = await truncatedTimeToDT(targetReply)
        let timeUntilTarget = await targetTime.diff(timeNow, 'seconds').values.seconds
        let timeUntilTargetFormatted = countdownFormat(timeUntilTarget)
        document.getElementById('timeUntil').innerHTML = `Time until Period ${await getCurrentPeriod()} ${await getCurrentCourse()} ends: ${timeUntilTargetFormatted}`
    }
    
    document.getElementById('currentTime').innerHTML = `Current time: ${timeNowFormatted}`
}

function setupTimer() {
    updateTimer() //runs the timer before the 1000ms delay so its ready at page load
    setInterval(updateTimer, 1000)
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

setupTimer()
initDatePickers()

timeOfNextPeriod()