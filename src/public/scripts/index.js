const luxon = require("luxon")
const axios = require("axios")

const DOMStrings = {
  greeting__quote: document.getElementById("greeting__quote"),
  greeting__author: document.getElementById("greeting__author"),
  calendar: document.getElementById("calendar"),
  calendar__headline: document.getElementById("calendar__headline"),
  calendar__buttonPrevious: document.getElementById("calendar__buttonPrevious"),
  calendar__buttonNext: document.getElementById("calendar__buttonNext"),
  clock__hour: document.getElementById("clock__hour"),
  clock__minute: document.getElementById("clock__minute"),
  clock__second: document.getElementById("clock__second"),
  alarms__digital: document.getElementById("alarms__digital"),
  course__container1: document.getElementById("course__container--first"),
  course__title1: document.getElementById("course__title1"),
  course__subtitle1: document.getElementById("course__subtitle1"),
  course__container2: document.getElementById("course__container--second"),
  course__title2: document.getElementById("course__title2"),
  course__subtitle2: document.getElementById("course__subtitle2"),
  course__container3: document.getElementById("course__container--third"),
  course__title3: document.getElementById("course__title3"),
  course__subtitle3: document.getElementById("course__subtitle3"),
  alarms__timer1: document.getElementById("alarms__timer1"),
  alarms__title1: document.getElementById("alarms__title1"),
};

const eventListeners = {
  calendarNavigation() {
    const calendar__buttonPrevious = DOMStrings.calendar__buttonPrevious;
    const calendar__buttonNext = DOMStrings.calendar__buttonNext;
    const calendar__headline = DOMStrings.calendar__headline;
    const calendar = DOMStrings.calendar;
    calendar__buttonPrevious.addEventListener("click", function () {
      let month = parseInt(calendar__headline.getAttribute("data-month"));
      let year = parseInt(calendar__headline.getAttribute("data-year"));
      for (let i = 0; i < 42; i++) {
        calendar.removeChild(calendar.lastChild);
      }
      if (month == 0) {
        month = 11;
        year = year - 1;
      } else {
        month = month - 1;
      }
      displayTime.displayMonthAndYear(month, year);
      displayTime.displayDays(month, year);
    });
    calendar__buttonNext.addEventListener("click", function () {
      let month = parseInt(calendar__headline.getAttribute("data-month"));
      let year = parseInt(calendar__headline.getAttribute("data-year"));
      for (let i = 0; i < 42; i++) {
        calendar.removeChild(calendar.lastChild);
      }
      if (month == 11) {
        month = 0;
        year = year + 1;
      } else {
        month = month + 1;
      }
      displayTime.displayMonthAndYear(month, year);
      displayTime.displayDays(month, year);
    });
  },
};

const greeting = {
    display() {
      const quotes = [
        "What lies behind you and what lies in front of you, pales in comparison to what lies inside you.",
        "The secret of getting ahead is getting started.",
        "Knowing is not enough; we must apply. Willing is not enough; we must do.",
        "Quality is not an act, it is a habit.",
        "Optimism is the faith that leads to achievement. Nothing can be done without hope and confidence.",
        "The will to win, the desire to succeed, the urge to reach your full potential... these are the keys that will unlock the door to personal excellence.",
        "Look up at the stars and not down at your feet. Try to make sense of what you see, and wonder about what makes the universe exist. Be curious.",
        "Do the one thing you think you cannot do. Fail at it. Try again. Do better the second time. The only people who never tumble are those who never mount the high wire. This is your moment. Own it.",
        "With the new day comes new strength and new thoughts.",
        "Well done is better than well said.",
        "Good, better, best. Never let it rest. 'Til your good is better and your better is best.",
        "It does not matter how slowly you go as long as you do not stop.",
        "Keep your eyes on the stars, and your feet on the ground.",
        "Accept the challenges so that you can feel the exhilaration of victory.",
        "The harder the conflict, the more glorious the triumph.",
        "If you're going through hell, keep going",
        "Be kind whenever possible. It is always possible.",
        "A good plan violently executed now is better than a perfect plan executed next week.",
        "It always seems impossible until it is done.",
        "Motivation is the art of getting people to do what you want them to do becuase they want to do it.",
      ];
      const authors = [
        "Ralph Waldo Emerson",
        "Mark Twain",
        "Johann Wolfgang Von Goethe",
        "Aristotle",
        "Helen Keller",
        "Confucius",
        "Stephen Hawking",
        "Oprah Winfrey",
        "Eleanor Roosevelt",
        "Benjamin Franklin",
        "Saint Jerome",
        "Confucius",
        "Theodore Roosevelt",
        "George S. Patton",
        "Thomas Paine",
        "Winston Churchill",
        "Dalai Lama",
        "George S. Patton",
        "Nelson Mandela",
        "Dwight D. Eisenhower",
      ];
      const randomChoice = Math.floor(Math.random() * 20);
      const greeting__quote = DOMStrings.greeting__quote;
      const greeting__author = DOMStrings.greeting__author;
      greeting__quote.innerText = `"${quotes[randomChoice]}"`;
      greeting__author.innerText = `${authors[randomChoice]}`;
    },
  };

const time = {
    updateDelay: 100,
    getCurrentMonth() {
      const month = new Date().getMonth();
      return month;
    },
    getCurrentYear() {
      const year = new Date().getFullYear();
      return year;
    },
    getFirstWeekDay(month, year) {
      const weekday = new Date(year, month, 1).getDay();
      return weekday;
    },
    getNumberOfDays(month, year) {
      const numberOfDays = new Date(year, month + 1, 0).getDate();
      return numberOfDays;
    },
    getToday() {
      const today = new Date().getDate();
      return today;
    },
    getHour() {
      const hour = new Date().getHours();
      return hour;
    },
    getMinute() {
      const minute = new Date().getMinutes();
      return minute;
    },
    getSecond() {
      const second = new Date().getSeconds();
      return second;
    },
  };

const displayTime = {
displayMonthAndYear(month, year) {
    let calendar__headline = DOMStrings.calendar__headline;
    calendar__headline.setAttribute("data-month", month);
    calendar__headline.setAttribute("data-year", year);
    switch (month) {
    case 0:
        month = "January";
        break;
    case 1:
        month = "February";
        break;
    case 2:
        month = "March";
        break;
    case 3:
        month = "April";
        break;
    case 4:
        month = "May";
        break;
    case 5:
        month = "June";
        break;
    case 6:
        month = "July";
        break;
    case 7:
        month = "August";
        break;
    case 8:
        month = "September";
        break;
    case 9:
        month = "October";
        break;
    case 10:
        month = "November";
        break;
    case 11:
        month = "December";
        break;
    }
    calendar__headline.innerText = `Your ${month} ${year}`;
},
displayDays(month, year) {
    const weekday = time.getFirstWeekDay(month, year);
    const numberOfDays = time.getNumberOfDays(month, year);
    const numberOfDaysPrevious = time.getNumberOfDays(month - 1, year);
    const calendar = DOMStrings.calendar;
    const today = time.getToday();
    let functionCounter = 0;
    for (
    let i = numberOfDaysPrevious - weekday + 1;
    i <= numberOfDaysPrevious;
    i++, functionCounter++
    ) {
    calendar.insertAdjacentHTML(
        "beforeend",
        `<a class="calendar__day--inactive">${i}</a>`
    );
    }
    for (let i = 1; i <= numberOfDays; i++, functionCounter++) {
    calendar.insertAdjacentHTML(
        "beforeend",
        `<a class="calendar__day">${i}</a>`
    );
    if (
        i == today &&
        month == time.getCurrentMonth() &&
        year == time.getCurrentYear()
    ) {
        calendar.lastElementChild.classList = "calendar__day--container";
        calendar.lastElementChild.innerText = "";
        calendar.lastElementChild.innerHTML = `<p class="calendar__day calendar__day--today">${i}</p>`;
    }
    }
    for (let i = 1; functionCounter < 42; i++, functionCounter++) {
    calendar.insertAdjacentHTML(
        "beforeend",
        `<a class="calendar__day--inactive">${i}</a>`
    );
    }
},
displayAnalogTime() {
    displayTime.displayAnalogTimeOnce()
    setInterval(displayTime.displayAnalogTimeOnce, time.updateDelay);
},
displayAnalogTimeOnce() {
    const clock__hour = DOMStrings.clock__hour;
    const clock__minute = DOMStrings.clock__minute;
    const clock__second = DOMStrings.clock__second;
    
    let hour = time.getHour() * 30;
    let minute = time.getMinute() * 6;
    let second = time.getSecond() * 6;
    clock__hour.style.transform = `rotateZ(${hour + minute / 12}deg)`;
    clock__minute.style.transform = `rotateZ(${minute}deg)`;
    clock__second.style.transform = `rotateZ(${second}deg)`;
},
displayDigitalTime() {
    displayTime.displayDigitalTimeOnce()
    setInterval(displayTime.displayDigitalTimeOnce, time.updateDelay);
},
displayDigitalTimeOnce() {
    const alarms__digital = DOMStrings.alarms__digital;
    
    let hour = time.getHour();
    let period;
    if (hour == 0) {
        hour = 12;
    } else if (hour < 12) {
        period = "AM";
    } else {
        hour = hour - 12;
        period = "PM";
    }
    let minute = time.getMinute();
    if (hour == 0) {
        hour = 12;
    }
    if (hour < 10) {
        hour = `0${hour}`;
    }
    if (minute < 10) {
        minute = `0${minute}`;
    }
    
    alarms__digital.innerText = `${hour}:${minute} ${period}`;
},
async displayNextCourse() {
    let timeNow = luxon.DateTime.local()
    let targetReply = await timeOfNextPeriod()
    
    if (await targetReply == 0) {
        let targetReplyNext = await timeOfNextPeriodStart()
        let timeNext = truncatedTimeToDT(targetReplyNext)
        let timeUntilNext = await timeNext.diff(timeNow, 'seconds').values.seconds
        createTimer(timeUntilNext, displayTime.displayNextCourse, "alarms__timer1", "hh:mm:ss")
        DOMStrings.alarms__title1.innerText = `Period ${await getCurrentPeriod()} ${await getCurrentCourse()} starts`
    } else if (!targetReply) {
        //make a function that can tell if there have been classes today, and change title accordingly
        DOMStrings.alarms__timer1.innerText = ''
        DOMStrings.alarms__title1.innerText = `No further classes scheduled for today`
        //technically, this will fail (classes will not update) at midnight. fixing this is low priority
    } else {
        let targetTime = truncatedTimeToDT(targetReply)
        let timeUntilTarget = await targetTime.diff(timeNow, 'seconds').values.seconds
        createTimer(timeUntilTarget, displayTime.displayNextCourse, "alarms__timer1", "hh:mm:ss")
        DOMStrings.alarms__title1.innerText = `Period ${await getCurrentPeriod()} ${await getCurrentCourse()} ends`
    }
    
    displayTime.displayNextCourseList()
},
async displayNextCourseList() {
    for (let i = 0; i < 3; i++) {
        const nextCourseInfo = await periodInfoByOffset((i + 1))
        let DOMTitle
        let DOMSubtitle
        let DOMContainer
        
        switch (i) {
            case 0:
                DOMTitle = DOMStrings.course__title1
                DOMSubtitle = DOMStrings.course__subtitle1
                DOMContainer = DOMStrings.course__container1
                break;
            case 1:
                DOMTitle = DOMStrings.course__title2
                DOMSubtitle = DOMStrings.course__subtitle2
                DOMContainer = DOMStrings.course__container2
                break;
            case 2:
                DOMTitle = DOMStrings.course__title3
                DOMSubtitle = DOMStrings.course__subtitle3
                DOMContainer = DOMStrings.course__container3
                break;
        }
        
        if (nextCourseInfo[0] == 0) {
            document.getElementById('course__headline').style.display = 'grid'
            DOMContainer.style.display = 'flex'
            DOMTitle.innerText = await nextCourseInfo[1]
            DOMSubtitle.innerText = `${nextCourseInfo[2]}, ${nextCourseInfo[3]} — ${nextCourseInfo[4]}`
        } else {
            DOMContainer.style.display = 'none'
        }
    }
},
};

function convertToTime(hour, minute, isPM) {
    //const timeNow = luxon.DateTime.local()
    
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
    /*
    if (Math.sign(convertedTime.diff(timeNow, 'days').values.days) === -1) {
        convertedTime = convertedTime.plus({ days: 1 })
    }
    */
    
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
        return `00:${minutesInInput}:${inputRounded}`
    } else {
        return `00:00:${inputRounded}`
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

function noFurtherClasses(error) {
    console.log(error)
    DOMStrings.alarms__title1.innerText = `No further classes scheduled for today`
}

async function timeOfNextPeriod() {
    try {
        const scheduleInfo = await getScheduleInfo(await getScheduleName())
        const currentTime = luxon.DateTime.local()
        let nextTime
        
        for (let i = 0; i < scheduleInfo.length; i++) {
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
        noFurtherClasses(error)
    }
}

async function timeOfNextPeriodStart() {
    try {
        const scheduleInfo = await getScheduleInfo(await getScheduleName())
        const currentTime = luxon.DateTime.local()
        let nextTime
        
        for (let i = 0; i < scheduleInfo.length; i++) {
            
            if (Math.sign(currentTime.diff(truncatedTimeToDT(scheduleInfo[i].timeEnd)).values.milliseconds) == 1) {
                continue
            } else {
                nextTime = await scheduleInfo[i].timeStart
                break //new
            }
        }
        return nextTime
    } catch (error) {
        noFurtherClasses(error)
    }
}

function getCurrentDayName() {
    return luxon.DateTime.local().weekdayLong
}

async function periodInfoByOffset(offset) {
    let errorlevel = 0
    try {
        const currentPeriod = await getCurrentPeriod()
        const dayInfo = await getDayInfo()
        const scheduleInfo = await getScheduleInfo(await getScheduleName())
        
        const requestedPeriod = (currentPeriod + offset) - 1
        const requestedCourse = dayInfo[requestedPeriod]
        const requestedSchedulePeriod = scheduleInfo[requestedPeriod]
        
        const requestedTitle = requestedCourse.name
        const requestedDay = getCurrentDayName()
        const requestedStart = requestedSchedulePeriod.timeStart
        const requestedEnd = requestedSchedulePeriod.timeEnd
        
        return [errorlevel, requestedTitle, requestedDay, requestedStart, requestedEnd]
    } catch (err) {
        //console.log(err)
        errorlevel = 1
        return [errorlevel]
    }
}

function getDayInfo() {
    let offset = 0
    
    return axios.get(`/day/${getDayOfWeek(offset)}`, {timeout: 3000})
    .then (function (response) {
        return response.data
    })
    .catch(function (error) {
        noFurtherClasses(error)
    })
}

function getAllEvents() {
    return axios.get(`/event`, {timeout: 3000})
    .then (function (response) {
        return response.data
    })
    .catch(function (error) {
        noFurtherClasses(error)
    })
}

function getScheduleName() {
    let offset = 0
            
    return axios.get(`/day/schedule/${getDayOfWeek(offset)}`, {timeout: 3000})
    .then (function (response) {
        return response.data
    })
    .catch(function (error) {
        noFurtherClasses(error)
    })
}

function getScheduleInfo(scheduleName) {
    return axios.get(`/schedule/${scheduleName}`, {timeout: 3000})
    .then(async function(response) {
        return response.data
    })
    .catch(function (error) {
        noFurtherClasses(error)
    })
}

async function getCurrentPeriod() {
    const scheduleInfo = await getScheduleInfo(await getScheduleName())
    const currentTime = luxon.DateTime.local()
    let currentPeriod
    
    for (let i = 0; i < scheduleInfo.length; i++) {
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
    
    for (let i = 0; i < dayInfo.length; i++) {
        if (dayInfo[i].period == currentPeriod) {
            currentCourse = await dayInfo[i].name
            return currentCourse
        } else {
            continue
        }
    }
}

function createTimer(secs, callback, elementID, format) {
    const intervalID = setInterval(() => {
        const durObj = luxon.Duration.fromObject({seconds: secs})
        const timeUntil = durObj.toFormat(format)
        document.getElementById(elementID).innerText = timeUntil
        secs--
        if (secs < 0) {
            clearInterval(intervalID)
            callback()
        }
    }, 1000)
}

function clearAllEvents(isPageOne) {
    document.getElementById("alarms__timer1").innerText = ''
    document.getElementById("alarms__title1").innerText = ''
    document.getElementById("alarms__timer2").innerText = ''
    document.getElementById("alarms__title2").innerText = ''
    document.getElementById("alarms__timer3").innerText = ''
    document.getElementById("alarms__title3").innerText = ''
    document.getElementById("alarms__module2").style.display = 'none'
    document.getElementById("alarms__module3").style.display = 'none'
    
    if (isPageOne) {
        displayTime.displayNextCourse()
    }
}

function insertEvent(position, title, subtitle) {
    switch (position) {
        case 1:
            document.getElementById("alarms__timer1").innerText = subtitle
            document.getElementById("alarms__title1").innerText = title
            break
        case 2:
            document.getElementById("alarms__timer2").innerText = subtitle
            document.getElementById("alarms__title2").innerText = title
            document.getElementById("alarms__module2").style.display = 'flex'
            break
        case 3:
            document.getElementById("alarms__timer3").innerText = subtitle
            document.getElementById("alarms__title3").innerText = title
            document.getElementById("alarms__module3").style.display = 'flex'
            break
    }
}

function getIndexFromPage(page) {
    return (((page - 1) * 3) - 1)
}

function updateEventsPages(currentPage, totalPages, totalObjects, eventsArray) {
    if (currentPage == 1) {
        document.getElementById("page__button__prev").style = 'background-color: silver'
    } else {
        document.getElementById("page__button__prev").style -= 'background-color: silver'
    }
    
    if (currentPage == totalPages) {
        document.getElementById("page__button__next").style = 'background-color: silver'
    } else {
        document.getElementById("page__button__next").style -= 'background-color: silver'
    }
    
    let id1
    let id2
    let id3
    
    if (currentPage == 1) {
        clearAllEvents(true)
        try {
            id1 = false
            insertEvent(2, eventsArray[0][0], eventsArray[0][1])
            id2 = eventsArray[0][2]
            insertEvent(3, eventsArray[1][0], eventsArray[1][1])
            id3 = eventsArray[1][2]
        } catch (err) {
            //console.log(err)
        }
    } else {
        clearAllEvents(false)
        try {
            insertEvent(1, eventsArray[getIndexFromPage(currentPage) + 0][0], eventsArray[getIndexFromPage(currentPage) + 0][1])
            id1 = eventsArray[getIndexFromPage(currentPage) + 0][2]
            insertEvent(2, eventsArray[getIndexFromPage(currentPage) + 1][0], eventsArray[getIndexFromPage(currentPage) + 1][1])
            id2 = eventsArray[getIndexFromPage(currentPage) + 1][2]
            insertEvent(3, eventsArray[getIndexFromPage(currentPage) + 2][0], eventsArray[getIndexFromPage(currentPage) + 2][1])
            id3 = eventsArray[getIndexFromPage(currentPage) + 2][2]
        } catch (err) {
            //console.log(err)
        }
    }
        
    document.getElementById("alarms__container--icon1").onclick = function() {
        if (id1) {
            removeEventByID(id1)
            setTimeout(function() {
                updateEvents(currentPage)
            }, 100)
        } else {
            document.getElementById("alarms__module1").style.animation = 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both'
            setTimeout(function() {
                document.getElementById("alarms__module1").style.animation -= 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both'
            }, 1500)
        }
    }
    
    document.getElementById("alarms__container--icon2").onclick = function() {
        removeEventByID(id2)
        setTimeout(function() {
            updateEvents(currentPage)
        }, 100)
    }
    
    document.getElementById("alarms__container--icon3").onclick = function() {
        removeEventByID(id3)
        setTimeout(function() {
            updateEvents(currentPage)
        }, 100)
    }
}

function removeEventByID(eventID) {
    axios.delete(`/event/byID/${eventID}`)
    .then(async function(response) {
        console.log(response)
    })
    .catch(function (error) {
        console.log(error)
    })
}

function expireOldEvents(eventsInfo) {
    for (let i = 0; i < eventsInfo.length; i++) {
        const currentObjDT = truncatedDateToDTUnformatted(eventsInfo[i].dueDate)
        const currentTime = luxon.DateTime.local()
        const timeDiff = currentObjDT.diff(currentTime, 'days').values.days
        
        if (timeDiff < -1) {
            axios.delete(`/event/${eventsInfo[i].dueDate}`)
            .then(async function(response) {
                console.log(response)
            })
            .catch(function (error) {
                console.log(error)
            })
        }
    }
}

async function updateEvents(reqPage) {
    
    const eventsInfo = await getAllEvents()
    const totalEvents = await eventsInfo.length
    const totalObjects = await totalEvents + 1
    
    refreshEmphasized(await eventsInfo)
    expireOldEvents(await eventsInfo)
    
    let currentPage
    let eventsArray = []
    
    const totalPages = Math.ceil(totalObjects / 3)
    
    if (reqPage) {
        if (reqPage > totalPages) {
            currentPage = totalPages
        } else {
            currentPage = reqPage
        }
    } else {
        currentPage = 1
    }
    
    if (currentPage == 1) {
        clearAllEvents(true)
    } else {
        clearAllEvents(false)
    }
    
    for (let i = 0; i < totalEvents; i++) {
        if (eventsInfo[i].course) {
            eventsArray.push([truncatedDateToDT(eventsInfo[i].dueDate), `[${eventsInfo[i].course}] ${eventsInfo[i].name}`, eventsInfo[i]._id])
        } else {
            eventsArray.push([truncatedDateToDT(eventsInfo[i].dueDate), eventsInfo[i].name, eventsInfo[i]._id])
        }
    }
    
    if (totalObjects > 3) {
        
        document.getElementById("page__button__next").onclick = function() {
            if (currentPage < totalPages) {
                currentPage++
                updateEventsPages(currentPage, totalPages, totalObjects, eventsArray)
            }
        }
        
        document.getElementById("page__button__prev").onclick = function() {
            if (currentPage > 1) {
                currentPage--
                updateEventsPages(currentPage, totalPages, totalObjects, eventsArray)
            }
        }
        
        document.getElementById("page__button__prev").style = 'background-color: silver'
        document.getElementById("events__page__container").style.display = 'flex'
        
    } else {
        document.getElementById("events__page__container").style.display = 'none'
    }
    
    updateEventsPages(currentPage, totalPages, totalObjects, eventsArray)
}

function truncatedDateToDT(input) {
    const splitArray = input.split('-')
    const createdDate = luxon.DateTime.fromObject({ year: splitArray[0], month: splitArray[1], day: splitArray[2] })
    const formattedDate = createdDate.toFormat('EEEE, MMMM d')
    
    return formattedDate
}

function truncatedDateToDTUnformatted(input) {
    const splitArray = input.split('-')
    const createdDate = luxon.DateTime.fromObject({ year: splitArray[0], month: splitArray[1], day: splitArray[2] })
    
    return createdDate
}

function refreshEmphasized(eventsInfo) {
    //broken? low priority (auto refresh yellow dots)
    /*
    try {
        
        for (let i = 0; i < 32; i++) {
            const aTags = document.getElementsByClassName("calendar__day--emphasized");
            for (let i = 0; aTags.length > i; i++) {
                aTags[i].classList.remove("calendar__day--emphasized")
            }
            
            const bTags = document.getElementsByClassName("calendar__day--container--emphasized");
            for (let i = 0; bTags.length > i; i++) {
                bTags[i].classList.remove("calendar__day--container--emphasized")
                bTags[i].classList.add("removed-calendar-day")
            }
            
            if (i == 32) {
                emphasizeDates(eventsInfo)
            }
        }
        
    } catch (err) {
        console.log(err)
    }
    */
    
    emphasizeDates(eventsInfo)
    
}

function emphasizeOnCalendar(date) {
    const aTags = document.getElementsByClassName("calendar__day");
    const searchText = date;
    let found;
    
    for (let i = 0; i < aTags.length; i++) {
      if (aTags[i].textContent == searchText) {
        found = aTags[i];
        break;
      }
    }
    
    let okToAdd = true
    
    for (let i = 0; i < found.classList.length; i++) {
        if (found.classList[i] == "calendar__day--emphasized") {
            okToAdd = false
            break
        }
        continue
    }
    
    let okToOverride = true
    
    for (let i = 0; i < found.parentNode.classList.length; i++) {
        if (found.parentNode.classList[i] == "removed-calendar-day") {
            okToOverride = false
            break
        }
        continue
    }
    
    if (okToAdd) {
        if (okToOverride) {
            const wrapper = document.createElement('div')
            wrapper.setAttribute("class", "calendar__day--container--emphasized")
            found.setAttribute("class", "calendar__day calendar__day--emphasized")
            found.parentNode.insertBefore(wrapper, found)
            wrapper.appendChild(found)
        } else {
            found.parentNode.classList.remove("removed-calendar-day")
            found.parentNode.setAttribute("class", "calendar__day--container--emphasized")
        }
    }
}

function emphasizeDates(eventsInfo) {
    const currentTime = luxon.DateTime.local()
    
    for (let i = 0; i < eventsInfo.length; i++) {
        const currentObjDT = truncatedDateToDTUnformatted(eventsInfo[i].dueDate)
        if (currentObjDT.month == currentTime.month && currentObjDT.year == currentTime.year) {
            const timeDiff = currentObjDT.diff(currentTime, 'days').values.days
            
            if (timeDiff > 0) {
                emphasizeOnCalendar(currentObjDT.day)
            }
        }
    }
}

displayTime.displayMonthAndYear(time.getCurrentMonth(), time.getCurrentYear());
displayTime.displayDays(time.getCurrentMonth(), time.getCurrentYear());
displayTime.displayAnalogTime();
displayTime.displayDigitalTime();
eventListeners.calendarNavigation();
greeting.display();

updateEvents(0)