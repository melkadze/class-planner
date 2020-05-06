///welcome to the frontend of class-planner, or loop!
///check us out at github.com/melkadze/class-planner

//requires made availible in frontend through browserify
const luxon = require("luxon")
const axios = require("axios")

const DOMStrings = {
  greeting__quote: document.getElementById("greeting__quote"),
  greeting__author: document.getElementById("greeting__author"),
  greeting__update__title: document.getElementById("greeting__update__title"),
  greeting__update__subtitle: document.getElementById("greeting__update"),
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
  dropdown__schedule: document.getElementById("dropdown__schedule"),
  options__schedule: document.getElementById("options__schedule"),
  icon__schedule: document.getElementById("icon__schedule"),
  text__schedule: document.getElementById("text__schedule"),
  dropdown__weekday: document.getElementById("dropdown__weekday"),
  options__weekday: document.getElementById("options__weekday"),
  icon__weekday: document.getElementById("icon__weekday"),
  text__weekday: document.getElementById("text__weekday"),
};

const updates = {
    title: "Stay in the loop:",
    subtitle: "We've just removed all of the non-essential fragments of the old design."
}

const timeouts = {
    net: 1000, //for network calls
    time: 1000, //for clock/time updates
    second: 1000, //for value of a second (do not change)
    animation: 1500, //for delay until allowing second animation
    delay: 100 //for allowing another action to finish
}

let pages = {
    events: 1,
    eventsPlus: 1,
    tasks: 1
}

let selections = {
    weekday: '',
    schedule: ''
}

const menu = {
    open(options, icon) {
        options.dataset.visibility = "visible";
        icon.src = "../assets/svg/caret--up.svg";
    },
    close(options, icon) {
        options.dataset.visibility = "hidden";
        icon.src = "../assets/svg/caret--down.svg";
    },
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
  dropdown() { //@note dropdown
    const dropdown__schedule = DOMStrings.dropdown__schedule;
    const options__schedule = DOMStrings.options__schedule;
    const icon__schedule = DOMStrings.icon__schedule;
    const text__schedule = DOMStrings.text__schedule;
    const dropdown__weekday = DOMStrings.dropdown__weekday;
    const options__weekday = DOMStrings.options__weekday;
    const icon__weekday = DOMStrings.icon__weekday;
    const text__weekday = DOMStrings.text__weekday;
    function initializeDropdown(dropdown, options, icon, text) {
      dropdown.addEventListener("click", () => {
        options.dataset.visibility == "hidden"
          ? menu.open(options, icon)
          : menu.close(options, icon);
      });
      Array.from(options.children).forEach((option) => {
        option.addEventListener("click", () => {
          text.innerText = option.innerText;
          if (isWeekday(text.innerText)) {
              selections.weekday = text.innerText
          } else {
              selections.schedule = text.innerText
          }
          text.dataset.text = "active";
          menu.close(options, icon);
        });
      });
    }
    initializeDropdown(
      dropdown__schedule,
      options__schedule,
      icon__schedule,
      text__schedule
    );
    initializeDropdown(
      dropdown__weekday,
      options__weekday,
      icon__weekday,
      text__weekday
    );
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
    setInterval(displayTime.displayAnalogTimeOnce, timeouts.time);
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
    setInterval(displayTime.displayDigitalTimeOnce, timeouts.time);
},
displayDigitalTimeOnce() {
    const alarms__digital = DOMStrings.alarms__digital;
    
    let hour = time.getHour();
    let period;
    if (hour == 0) {
        hour = 12;
        period = "AM";
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
        if (pages.events == 1) {
            DOMStrings.alarms__timer1.innerText = ''
            DOMStrings.alarms__title1.innerText = `No further classes scheduled for today`
        }
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
    //console.log(error)
    if (pages.events == 1) {
        DOMStrings.alarms__title1.innerText = `No further classes scheduled for today`
    }
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
                break
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
    
    return axios.get(`/day/${getDayOfWeek(offset)}`, {timeout: timeouts.net})
    .then (function (response) {
        return response.data
    })
    .catch(function (error) {
        //phase out these noFurtherClasses, and all error msgs (at least for shipping)
        noFurtherClasses(error)
    })
}

function getFullDayInfo() {
    return axios.get(`/day`, {timeout: timeouts.net})
    .then (function (response) {
        return response.data
    })
    .catch(function (error) {
        //console.log(error)
    })
}

function getAllEvents() {
    return axios.get(`/event`, {timeout: timeouts.net})
    .then (function (response) {
        return response.data
    })
    .catch(function (error) {
        //console.log(error)
    })
}

function getAllTasks() {
    return axios.get(`/task`, {timeout: timeouts.net})
    .then (function (response) {
        return response.data
    })
    .catch(function (error) {
        //console.log(error)
    })
}

function getScheduleName() {
    let offset = 0
            
    return axios.get(`/day/schedule/${getDayOfWeek(offset)}`, {timeout: timeouts.net})
    .then (function (response) {
        return response.data
    })
    .catch(function (error) {
        noFurtherClasses(error)
    })
}

function getScheduleInfo(scheduleName) {
    return axios.get(`/schedule/${scheduleName}`, {timeout: timeouts.net})
    .then(async function(response) {
        return response.data
    })
    .catch(function (error) {
        noFurtherClasses(error)
    })
}

function getFullScheduleInfo() {
    return axios.get(`/schedule`, {timeout: timeouts.net})
    .then(async function(response) {
        return response.data
    })
    .catch(function (error) {
        //console.log(error)
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
    }, timeouts.second)
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
        document.getElementById("alarms__module1").style.display = 'flex'
        displayTime.displayNextCourse()
    } else {
        document.getElementById("alarms__module1").style.display = 'none'
    }
}

function insertEvent(position, title, subtitle) {
    switch (position) {
        case 1:
            document.getElementById("alarms__timer1").innerText = subtitle
            document.getElementById("alarms__title1").innerText = title
            document.getElementById("alarms__module1").style.display = 'flex'
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

function getEventIndexFromPage(page) {
    //return (((page - 1) * 3) - 1) former code (for three items plus indicators on events page)
    return (((page - 1) * 2) - 1)
}

function addEventsPlusPages() {
    pages.eventsPlus++
    updateEventsPlusPages()
}

function subtractEventsPlusPages() {
    pages.eventsPlus--
    updateEventsPlusPages()
}

function updateEventsPlusPages() {
    let currentPage = pages.eventsPlus
    let totalPages = 3
    
    if (currentPage == 1) {
        document.getElementById("page__button__prev__plus").style = 'background-color: silver'
    } else {
        document.getElementById("page__button__prev__plus").style -= 'background-color: silver'
    }
    
    if (currentPage == totalPages) {
        document.getElementById("page__button__next__plus").style = 'background-color: silver'
    } else {
        document.getElementById("page__button__next__plus").style -= 'background-color: silver'
    }
    
    switch (currentPage) {
        case 1:
            setDisplayProperty("material__group1", "block")
            setDisplayProperty("material__group2", "none")
            setDisplayProperty("material__group3", "none")
            break
        case 2:
            setDisplayProperty("material__group1", "none")
            setDisplayProperty("material__group2", "block")
            setDisplayProperty("material__group3", "none")
            break
        case 3:
            setDisplayProperty("material__group1", "none")
            setDisplayProperty("material__group2", "none")
            setDisplayProperty("material__group3", "block")
            break
    }
}

function updateEventsPages(currentPage, totalPages, totalObjects, eventsArray) {
    pages.events = currentPage
    
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
    
    setDisplayProperty("events__plus__container__back", "none")
    initDatePickers('events')
    pages.eventsPlus = 1
    
    if (currentPage == 1) {
        clearAllEvents(true)
        try {
            id1 = false
            insertEvent(2, eventsArray[0][0], eventsArray[0][1])
            id2 = eventsArray[0][2]
            //insertEvent(3, eventsArray[1][0], eventsArray[1][1])
            //id3 = eventsArray[1][2]
        } catch (err) {
            //console.log(err)
        }
    } else {
        clearAllEvents(false)
        try {
            
            if (!(currentPage == totalPages && !(eventsArray[getEventIndexFromPage(currentPage)]))) {
            
                insertEvent(1, eventsArray[getEventIndexFromPage(currentPage) + 0][0], eventsArray[getEventIndexFromPage(currentPage) + 0][1])
                id1 = eventsArray[getEventIndexFromPage(currentPage) + 0][2]
                insertEvent(2, eventsArray[getEventIndexFromPage(currentPage) + 1][0], eventsArray[getEventIndexFromPage(currentPage) + 1][1])
                id2 = eventsArray[getEventIndexFromPage(currentPage) + 1][2]
                
                //insertEvent(3, eventsArray[getEventIndexFromPage(currentPage) + 2][0], eventsArray[getEventIndexFromPage(currentPage) + 2][1]) unrem for 3 events
                //id3 = eventsArray[getEventIndexFromPage(currentPage) + 2][2] unrem for 3 events
                
            }
        } catch (err) {
            //console.log(err)
        }
    }
    
    if (currentPage == totalPages) {
        setDisplayProperty("plus__container__event", "flex")
    } else {
        setDisplayProperty("plus__container__event", "none")
    }
        
    document.getElementById("alarms__container--icon1").onclick = function() {
        if (id1) {
            removeEventByID(id1)
            setTimeout(function() {
                updateEvents(currentPage)
            }, timeouts.delay)
        } else {
            document.getElementById("alarms__module1").style.animation = 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both'
            setTimeout(function() {
                document.getElementById("alarms__module1").style.animation -= 'shake 0.82s cubic-bezier(.36,.07,.19,.97) both'
            }, timeouts.animation)
        }
    }
    
    document.getElementById("alarms__container--icon2").onclick = function() {
        removeEventByID(id2)
        setTimeout(function() {
            updateEvents(currentPage)
        }, timeouts.delay)
    }
    
    document.getElementById("alarms__container--icon3").onclick = function() {
        removeEventByID(id3)
        setTimeout(function() {
            updateEvents(currentPage)
        }, timeouts.delay)
    }
}

function removeEventByID(eventID) {
    axios.delete(`/event/byID/${eventID}`)
    .then(async function(response) {
        //console.log(response)
    })
    .catch(function (error) {
        //console.log(error)
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
                //console.log(response)
            })
            .catch(function (error) {
                //console.log(error)
            })
        }
    }
}

function setDisplayProperty(id, property) {
    document.getElementById(id).style.display = property
}

async function updateEvents(reqPage) {
    
    const eventsInfo = await getAllEvents()
    const totalEvents = await eventsInfo.length
    const totalObjects = await totalEvents + 2
    
    expireOldEvents(await eventsInfo)
    setTimeout(refreshEmphasizedEvents(await eventsInfo), timeouts.delay) //waits for expires to happen
    
    let currentPage
    let eventsArray = []
    let totalPages
    
    if (totalObjects == 3) {
        totalPages = 1 //wasnt here when 3 objs (the entire if statement)
    } else {
        totalPages = Math.ceil(totalObjects / 2) //change to 3 to have 3 objs
    }
    
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
            eventsArray.push([truncatedDateToFormattedDT(eventsInfo[i].dueDate), `[${eventsInfo[i].course}] ${eventsInfo[i].name}`, eventsInfo[i]._id])
        } else {
            eventsArray.push([truncatedDateToFormattedDT(eventsInfo[i].dueDate), eventsInfo[i].name, eventsInfo[i]._id])
        }
    }
    
    if (totalObjects > 3) { //change to 3 to have 3 objs
        
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

function truncatedDateToFormattedDT(input) {
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

function refreshEmphasizedEvents(eventsInfo) {
    //broken? low priority (auto refresh dots)
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
                emphasizeEventDates(eventsInfo)
            }
        }
        
    } catch (err) {
        //console.log(err)
    }
    */
    
    emphasizeEventDates(eventsInfo)
    
}

function emphasizeEventOnCalendar(date) {
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

function emphasizeEventDates(eventsInfo) {
    const currentTime = luxon.DateTime.local()
    
    for (let i = 0; i < eventsInfo.length; i++) {
        const currentObjDT = truncatedDateToDTUnformatted(eventsInfo[i].dueDate)
        if (currentObjDT.month == currentTime.month && currentObjDT.year == currentTime.year) {
            const timeDiff = currentObjDT.diff(currentTime, 'days').values.days
            
            if (timeDiff > 0) {
                emphasizeEventOnCalendar(currentObjDT.day)
            }
        }
    }
}

function clearAllTasks() {
    document.getElementById("tasks__title1").innerText = ''
    document.getElementById("tasks__title2").innerText = ''
    document.getElementById("tasks__title3").innerText = ''
    document.getElementById("tasks__title4").innerText = ''
    document.getElementById("tasks__subtitle1").innerText = ''
    document.getElementById("tasks__subtitle2").innerText = ''
    document.getElementById("tasks__subtitle3").innerText = ''
    document.getElementById("tasks__subtitle4").innerText = ''
    document.getElementById("tasks__container1").style.display = 'none'
    document.getElementById("tasks__container2").style.display = 'none'
    document.getElementById("tasks__container3").style.display = 'none'
    document.getElementById("tasks__container4").style.display = 'none'
}

function insertTask(position, subtitle, title) {
    switch (position) {
        case 1:
            document.getElementById("tasks__title1").innerText = title
            document.getElementById("tasks__subtitle1").innerText = subtitle
            document.getElementById("tasks__container1").style.display = 'flex'
            break
        case 2:
            document.getElementById("tasks__title2").innerText = title
            document.getElementById("tasks__subtitle2").innerText = subtitle
            document.getElementById("tasks__container2").style.display = 'flex'
            break
        case 3:
            document.getElementById("tasks__title3").innerText = title
            document.getElementById("tasks__subtitle3").innerText = subtitle
            document.getElementById("tasks__container3").style.display = 'flex'
            break
        case 4:
            document.getElementById("tasks__title4").innerText = title
            document.getElementById("tasks__subtitle4").innerText = subtitle
            document.getElementById("tasks__container4").style.display = 'flex'
            break
    }
}

function getTaskIndexFromPage(page) {
    return ((page - 1) * 4)
}

function updateTasksPages(currentPage, totalPages, totalObjects, tasksArray) {
    pages.tasks = currentPage
    
    if (currentPage == 1) {
        document.getElementById("task__button__prev").style = 'background-color: silver'
    } else {
        document.getElementById("task__button__prev").style -= 'background-color: silver'
    }
    
    if (currentPage == totalPages) {
        document.getElementById("task__button__next").style = 'background-color: silver'
    } else {
        document.getElementById("task__button__next").style -= 'background-color: silver'
    }
    
    //revamp:: resize buttons (force square, for both sets)
    
    let id1
    let id2
    let id3
    let id4
    
    clearAllTasks()
    setDisplayProperty("tasks__plus__container__back", "none")
    initDatePickers('tasks')
    
    if (currentPage == 1) {
        try {
            for (let i = 0; i < 4; i++) {
                insertTask((i + 1), tasksArray[i][0], tasksArray[i][1])
                switch (i) {
                    case 0:
                        id1 = tasksArray[i][2]
                        break
                    case 1:
                        id2 = tasksArray[i][2]
                        break
                    case 2:
                        id3 = tasksArray[i][2]
                        break
                    case 3:
                        id4 = tasksArray[i][2]
                        break
                }
            }
        } catch (err) {
            //console.log(err)
        }
    } else {
        clearAllTasks(false)
        try {
            
            if (!(currentPage == totalPages && !(tasksArray[getTaskIndexFromPage(currentPage)]))) {
            
                for (let i = 0; i < 4; i++) {
                    let returnedIndex = getTaskIndexFromPage(currentPage)
                    let currentIndex = returnedIndex + i
                    insertTask((i + 1), tasksArray[currentIndex][0], tasksArray[currentIndex][1])
                    switch (i) {
                        case 0:
                            id1 = tasksArray[currentIndex][2]
                            break
                        case 1:
                            id2 = tasksArray[currentIndex][2]
                            break
                        case 2:
                            id3 = tasksArray[currentIndex][2]
                            break
                        case 3:
                            id4 = tasksArray[currentIndex][2]
                            break
                    }
                }
            }
        } catch (err) {
            //console.log(err)
        }
    }
    
    if (currentPage == totalPages) {
        setDisplayProperty("tasks__plus__container", "flex")
    } else {
        setDisplayProperty("tasks__plus__container", "none")
    }
        
    document.getElementById("tasks__container--icon1").onclick = function() {
        removeTaskByID(id1)
        setTimeout(function() {
            updateTasks(currentPage)
        }, timeouts.delay)
    }
    
    document.getElementById("tasks__container--icon2").onclick = function() {
        removeTaskByID(id2)
        setTimeout(function() {
            updateTasks(currentPage)
        }, timeouts.delay)
    }
    
    document.getElementById("tasks__container--icon3").onclick = function() {
        removeTaskByID(id3)
        setTimeout(function() {
            updateTasks(currentPage)
        }, timeouts.delay)
    }
    
    document.getElementById("tasks__container--icon4").onclick = function() {
        removeTaskByID(id4)
        setTimeout(function() {
            updateTasks(currentPage)
        }, timeouts.delay)
    }
}

function removeTaskByID(taskID) {
    axios.delete(`/task/byID/${taskID}`)
    .then(async function(response) {
        //console.log(response)
    })
    .catch(function (error) {
        //console.log(error)
    })
}

function expireOldTasks(tasksInfo) {
    for (let i = 0; i < tasksInfo.length; i++) {
        const currentObjDT = truncatedDateToDTUnformatted(tasksInfo[i].dueDate)
        const currentTime = luxon.DateTime.local()
        const timeDiff = currentObjDT.diff(currentTime, 'days').values.days
        
        if (timeDiff < -1) {
            axios.delete(`/task/${tasksInfo[i].dueDate}`)
            .then(async function(response) {
                //console.log(response)
            })
            .catch(function (error) {
                //console.log(error)
            })
        }
    }
}

async function updateTasks(reqPage) {
    
    const tasksInfo = await getAllTasks()
    const totalTasks = await tasksInfo.length
    const totalObjects = await totalTasks + 1
    
    //expireOldTasks(await tasksInfo) may be destructive, wait for user to request this action
    //setTimeout(emphasizeEventDates(await tasksInfo), timeouts.delay)
    emphasizeEventDates(await tasksInfo) //waiting for expires not necessary, as we aren't expiring tasks automatically
    
    let currentPage
    let tasksArray = []
    let totalPages
    
    if (totalObjects == 5) {
        totalPages = 1
    } else {
        totalPages = Math.ceil(totalObjects / 4)
    }
    
    if (reqPage) {
        if (reqPage > totalPages) {
            currentPage = totalPages
        } else {
            currentPage = reqPage
        }
    } else {
        currentPage = 1
    }
    
    clearAllTasks()
    
    for (let i = 0; i < totalTasks; i++) {
        if (tasksInfo[i].course) {
            tasksArray.push([truncatedDateToFormattedDT(tasksInfo[i].dueDate), `[${tasksInfo[i].course}] ${tasksInfo[i].name}`, tasksInfo[i]._id])
        } else {
            tasksArray.push([truncatedDateToFormattedDT(tasksInfo[i].dueDate), tasksInfo[i].name, tasksInfo[i]._id])
        }
    }
    
    if (totalObjects > 5) {
        
        document.getElementById("task__button__next").onclick = function() {
            if (currentPage < totalPages) {
                currentPage++
                updateTasksPages(currentPage, totalPages, totalObjects, tasksArray)
            }
        }
        
        document.getElementById("task__button__prev").onclick = function() {
            if (currentPage > 1) {
                currentPage--
                updateTasksPages(currentPage, totalPages, totalObjects, tasksArray)
            }
        }
        
        document.getElementById("task__button__prev").style = 'background-color: silver'
        document.getElementById("task__page__container").style.display = 'flex'
        
    } else {
        document.getElementById("task__page__container").style.display = 'none'
    }
    
    updateTasksPages(currentPage, totalPages, totalObjects, tasksArray)
}

function initDatePickers(givenName) {
    let timeNow = luxon.DateTime.local()
    let timeNowFormatted = timeNow.toFormat('LL/dd/yyyy')
    
    if (givenName == 'tasks') {
        document.getElementById("tasks__plus__date__input").value = timeNowFormatted
        document.getElementById("tasks__plus__task__input").value = ''
        document.getElementById("tasks__plus__course__input").value = ''
        document.getElementById("tasks__plus__container__error").innerText = ''
    } else if (givenName == 'events') {
        document.getElementById("events__plus__date__input").value = timeNowFormatted
        document.getElementById("events__plus__event__input").value = ''
        document.getElementById("events__plus__course__input").value = ''
        document.getElementById("events__plus__container__error").innerText = ''
    } else {
        document.getElementById("tasks__plus__date__input").value = timeNowFormatted
        document.getElementById("tasks__plus__task__input").value = ''
        document.getElementById("tasks__plus__course__input").value = ''
        document.getElementById("tasks__plus__container__error").innerText = ''
        document.getElementById("events__plus__date__input").value = timeNowFormatted
        document.getElementById("events__plus__event__input").value = ''
        document.getElementById("events__plus__course__input").value = ''
        document.getElementById("events__plus__container__error").innerText = ''
    }
    
}

function initPlusButtons() {
    initDatePickers()
    
    updateEventsPlusPages()
    
    document.getElementById("page__button__prev__plus").onclick = function () {
        if (pages.eventsPlus != 1) {
            subtractEventsPlusPages()
        }
    }
    
    document.getElementById("page__button__next__plus").onclick = function () {
        if (pages.eventsPlus != 3) {
            addEventsPlusPages()
        }
    }
    
    document.getElementById("tasks__plus__container").onclick = function () {
        setDisplayProperty("tasks__plus__container", "none")
        setDisplayProperty("tasks__plus__container__back", "flex")
    }
    
    document.getElementById("tasks__plus__container--icon--cross").onclick = function () {
        setDisplayProperty("tasks__plus__container__back", "none")
        setDisplayProperty("tasks__plus__container", "flex")
        initDatePickers('tasks')
    }
    
    document.getElementById("plus__container__event").onclick = function () {
        setDisplayProperty("plus__container__event", "none")
        setDisplayProperty("events__plus__container__back", "flex")
    }
    
    document.getElementById("events__plus__container--icon--cross").onclick = function () {
        setDisplayProperty("events__plus__container__back", "none")
        setDisplayProperty("plus__container__event", "flex")
        initDatePickers('events')
    }
    
    document.getElementById("tasks__plus__container--icon").onclick = function () {
        
        if (document.getElementById("tasks__plus__task__input").value != '' && document.getElementById("tasks__plus__date__input").value) {
            let dateFormatted
            
            try {
                const inputDateArray = document.getElementById("tasks__plus__date__input").value.split('/')
                
                if (!(inputDateArray[0]) || !(inputDateArray[1]) || !(inputDateArray[2])) {
                    throw new Error("Please enter a valid date") //maybe make this silent
                }
                
                dateFormatted = `${inputDateArray[2]}-${inputDateArray[0]}-${inputDateArray[1]}`
                
                if (truncatedDateToFormattedDT(dateFormatted) == 'Invalid DateTime') {
                    throw new Error("Please enter a valid date") //maybe make this silent
                }
                
                try {
                    axios.post(`/task/upload`, {
                        name: document.getElementById("tasks__plus__task__input").value,
                        course: document.getElementById('tasks__plus__course__input').value,
                        dueDate: dateFormatted
                    })
                    .then (function (response) {
                        //console.log(response)
                        updateTasks(false)
                    })
                    .catch(function (error) {
                        //console.log(err)
                    })
                } catch (err) {
                    console.log(err)
                }
                
                setDisplayProperty("tasks__plus__container__back", "none")
                setDisplayProperty("tasks__plus__container", "flex")
                initDatePickers('tasks')
                
            } catch (err) {
                document.getElementById("tasks__plus__container__error").innerText = 'Please enter a valid date'
                console.log(err)
            }
        } else if (document.getElementById("tasks__plus__task__input").value == '' && document.getElementById("tasks__plus__date__input").value == '') {
            document.getElementById("tasks__plus__container__error").innerText = 'Please enter a task name and due date'
        } else if (document.getElementById("tasks__plus__task__input").value == '') {
            document.getElementById("tasks__plus__container__error").innerText = 'Please enter a task name'
        } else if (document.getElementById("tasks__plus__date__input").value == '') {
            document.getElementById("tasks__plus__container__error").innerText = 'Please enter a due date'
        } else {
            document.getElementById("tasks__plus__container__error").innerText = 'Please enter a valid date'
        }
    }
    
    document.getElementById("events__plus__container--icon").onclick = function () {
        
        let pastDate = false
        
        if (document.getElementById("events__plus__event__input").value != '' && document.getElementById("events__plus__date__input").value) {
            let dateFormatted
            
            try {
                const inputDateArray = document.getElementById("events__plus__date__input").value.split('/')
                
                if (!(inputDateArray[0]) || !(inputDateArray[1]) || !(inputDateArray[2])) {
                    throw new Error("Please enter a valid date") //maybe make this silent
                }
                
                dateFormatted = `${inputDateArray[2]}-${inputDateArray[0]}-${inputDateArray[1]}`
                
                if (truncatedDateToFormattedDT(dateFormatted) == 'Invalid DateTime') {
                    throw new Error("Please enter a valid date") //maybe make this silent
                }
                
                const currentObjDT = truncatedDateToDTUnformatted(dateFormatted)
                const currentTime = luxon.DateTime.local()
                const timeDiff = currentObjDT.diff(currentTime, 'days').values.days
                
                if (timeDiff < -1) {
                    pastDate = true
                    throw new Error("Please enter a future or present date")
                }
                
                try {
                    axios.post(`/event/upload`, {
                        name: document.getElementById("events__plus__event__input").value,
                        course: document.getElementById('events__plus__course__input').value,
                        dueDate: dateFormatted
                    })
                    .then (function (response) {
                        //console.log(response)
                        updateEvents(false)
                    })
                    .catch(function (error) {
                        //console.log(err)
                    })
                
                    setDisplayProperty("events__plus__container__back", "none")
                    setDisplayProperty("plus__container__event", "flex")
                    initDatePickers('events')
                    
                } catch (err) {
                    console.log(err)
                    if (pastDate) {
                        document.getElementById("events__plus__container__error").innerText = 'Please enter a future or present date'
                    } else {
                        document.getElementById("events__plus__container__error").innerText = 'Please enter a valid date'
                    }
                }
                
            } catch (err) {
                console.log(err)
                if (pastDate) {
                    document.getElementById("events__plus__container__error").innerText = 'Please enter a future or present date'
                } else {
                    document.getElementById("events__plus__container__error").innerText = 'Please enter a valid date'
                }
            }
        } else if (document.getElementById("events__plus__event__input").value == '' && document.getElementById("events__plus__date__input").value == '') {
            document.getElementById("events__plus__container__error").innerText = 'Please enter an event name and due date'
        } else if (document.getElementById("events__plus__event__input").value == '') {
            document.getElementById("events__plus__container__error").innerText = 'Please enter an event name'
        } else if (document.getElementById("events__plus__date__input").value == '') {
            document.getElementById("events__plus__container__error").innerText = 'Please enter a due date'
        } else {
            document.getElementById("events__plus__container__error").innerText = 'Please enter a valid date'
        }
    }
}

async function getNewQuote() {
    return axios.get(`https://quote-garden.herokuapp.com/api/v2/quotes/random`, {timeout: timeouts.net})
    .then (function (response) {
        return response.data
    })
    .catch(function (error) {
        greeting.display();
    })
}

async function applyNewQuote() {
    DOMStrings.greeting__update__title.innerText = updates.title;
    DOMStrings.greeting__update__subtitle.innerText = updates.subtitle;
    try {
        const response = await getNewQuote()
        const quoteAuthor = await response.quote.quoteAuthor
        const quoteText = await response.quote.quoteText
        DOMStrings.greeting__quote.innerText = await quoteText
        if (await quoteAuthor) {
            DOMStrings.greeting__author.innerText = await quoteAuthor
        } else {
            DOMStrings.greeting__author.innerText = 'Unknown'
        }
    } catch {
        greeting.display();
    }
}

async function isPeriodValidForSchedule(period, schedule) {
    const scheduleInfo = await getScheduleInfo(schedule)
    for (let i = 0; i < await scheduleInfo.length; i++) {
        if (await scheduleInfo[i].period == period) {
            return true
        } else {
            continue
        }
    }
    return false
}

function loginSwitchTo(page) {
    document.getElementById("login__switcher").style.animation = ''
    document.getElementById("login__switcher").style.animation = 'fadeOut 0.6s ease-in-out'
    setTimeout(() => {
        document.getElementById("login__switcher").style.animation = ''
        let newMessage
        switch (page) {
            case 1:
                newMessage = 'a complete suite of student organization tools'
                break
            case 2:
                newMessage = 'a planner to keep track of your events and tasks'
                break
            case 3:
                newMessage = 'a dashboard to monitor the time you spend in class'
                break
            case 4:
                newMessage = 'a look into the rest of your day'
                break
            case 5:
                newMessage = 'a versatile tool to help you manage your school life'
                break
        }
        document.getElementById("login__switcher").innerText = newMessage
        document.getElementById("login__switcher").style.animation = 'fadeIn 0.6s ease-in-out'
    }, 500)
}

function loginSwitcher() {
    let page = 2
    
    setInterval(() => {
        loginSwitchTo(page)
        if (page >= 5) {
            page = 1
        } else {
            page++
        }
    }, timeouts.second * 3)
}

function getDocumentTitle() {
    return document.title
}

function setupDashboardPage() {
    displayTime.displayMonthAndYear(time.getCurrentMonth(), time.getCurrentYear()); 
    displayTime.displayDays(time.getCurrentMonth(), time.getCurrentYear());
    displayTime.displayAnalogTime();
    displayTime.displayDigitalTime();
    eventListeners.calendarNavigation();
    
    applyNewQuote()
    updateEvents(false)
    updateTasks(false)
    initPlusButtons()
}

function setupLoginPage() {
    loginSwitcher()
}

function createSchedule(scheduleName, elementID) {
    axios.post(`/schedule/upload`, {
        name: scheduleName
    })
    .then (function (response) {
        document.getElementById(elementID).innerText = 'Schedule created.'
    })
    .catch(function (error) {
        document.getElementById(elementID).innerText = 'Please enter a name under 32 characters.'
    })
}

function isWeekday(input) {
    if (input == 'Monday' || input == 'Tuesday' || input == 'Wednesday' || input == 'Thursday' || input == 'Friday' || input == 'Saturday' || input == 'Sunday') {
        return true
    } else {
        return false
    }
}

function dayNameToNumber(input) {
    switch (input) {
        case 'Monday':
            return 0
        case 'Tuesday':
            return 1
        case 'Wednesday':
            return 2
        case 'Thursday':
            return 3
        case 'Friday':
            return 4
        case 'Saturday':
            return 5
        case 'Sunday':
            return 6
        default:
            throw new Error('Not a valid weekday')
    }
}

function createDay(dayNumber, schedule, elementID) {
    axios.post(`/day/upload`, {
        day: dayNumber,
        schedule: schedule
    })
    .then (function (response) {
        document.getElementById(elementID).innerText = 'Schedule applied.'
    })
    .catch(function (error) {
        console.log(schedule)
        document.getElementById(elementID).innerText = 'Schedule not applied due to a network error.'
        console.log(error)
    })
}

function insertAfter(el, referenceNode) {
    referenceNode.parentNode.insertBefore(el, referenceNode.nextSibling);
}

function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
  
    // Change this to div.childNodes to support multiple top-level nodes
    return div.firstChild; 
  }

async function initCourseMainButtons() { //@note buttons
    let fullScheduleInfo = await getFullScheduleInfo()
    
    for (let i = 0; i < await fullScheduleInfo.length; i++) {
        document.getElementById("options__schedule").appendChild(
            createElementFromHTML(`<div class="courses__option"> <p class="courses__text--alternative">${await fullScheduleInfo[i].name}</p> </div>`)
        )
    }
    
    eventListeners.dropdown();
    
    document.getElementById("courses__button__apply").onclick = async function () {
        if (selections.schedule != '' && selections.weekday != '') {
            let day = dayNameToNumber(selections.weekday)
            let schedule = selections.schedule
            let dayInfo = await getFullDayInfo()
            
            let doesDayExist = false
            
            for (let i = 0; i < await dayInfo.length; i++) {
                if (await dayInfo[i].day == day) {
                    doesDayExist = true
                    break
                } else {
                    continue
                }
            }
            
            if (doesDayExist) {
                axios.delete(`/day/${day}`)
                .then(async function(response) {
                    createDay(day, schedule, 'courses__text__apply')
                })
                .catch(function (error) {
                    //console.log(error)
                })
            } else {
                createDay(day, schedule, 'courses__text__apply')
            }
            
        }
    }
    
    document.getElementById("courses__button__create").onclick = function () {
        const scheduleName = document.getElementById("course__input__create").value
        
        if (scheduleName) {
            createSchedule(scheduleName, 'courses__text__create')
        }
    }
}

function setupCoursesPage() {
    initCourseMainButtons()
}

function setupRelevantPage() {
    const docTitle = getDocumentTitle()
    switch (docTitle) {
        case 'Loop: Dashboard':
            setupDashboardPage()
            break
        case 'Loop: Login':
            setupLoginPage()
            break
        case 'Loop: Courses':
            setupCoursesPage()
            break
    }
}

setupRelevantPage()