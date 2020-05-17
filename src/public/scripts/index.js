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
}

const updates = {
	title: "Stay in the loop:",
	subtitle: "[v1.2] Dates of all times are always emphasized now. Thank you for using Loop!"
}

const timeouts = {
	net: 2000, //for network calls
	time: 1000, //for clock/time updates
	second: 1000, //for value of a second (do not change)
	animation: 1500, //for delay until allowing second animation
	delay: 100 //for allowing another action to finish
}

let pages = {
	events: 1,
	eventsPlus: 1,
	tasks: 1,
	schedules: 1,
	scheduleSubmenu: 1,
	scheduleStore: [],
	schedulesPlus: 1,
	courses: 1,
	courseSubmenu: 1,
	courseStore: [],
	coursesPlus: 1
}

let store = {
	period1: "",
	period2: "",
	period3: "",
	period4: "",
	period5: "",
	period6: "",
	period7: "",
	period8: "",
	period9: "",
	course1: "",
	course2: "",
	course3: "",
	course4: "",
	course5: "",
	course6: "",
	course7: "",
	course8: "",
	course9: "",
	dates: []
}

let selections = {
	weekday: "",
	schedule: "",
	scheduleTitle: "",
	dayTitle: ""
}

const menu = {
	open(options, icon) {
		options.dataset.visibility = "visible"
		icon.src = "../assets/svg/caret--up.svg"
	},
	close(options, icon) {
		options.dataset.visibility = "hidden"
		icon.src = "../assets/svg/caret--down.svg"
	},
}

const eventListeners = {
	calendarNavigation() {
		const calendar__buttonPrevious = DOMStrings.calendar__buttonPrevious
		const calendar__buttonNext = DOMStrings.calendar__buttonNext
		const calendar__headline = DOMStrings.calendar__headline
		const calendar = DOMStrings.calendar
		calendar__buttonPrevious.addEventListener("click", function () {
			let month = parseInt(calendar__headline.getAttribute("data-month"))
			let year = parseInt(calendar__headline.getAttribute("data-year"))
			for (let i = 0; i < 42; i++) {
				calendar.removeChild(calendar.lastChild)
			}
			if (month == 0) {
				month = 11
				year = year - 1
			} else {
				month = month - 1
			}
			displayTime.displayMonthAndYear(month, year)
			displayTime.displayDays(month, year)
		})
		calendar__buttonNext.addEventListener("click", function () {
			let month = parseInt(calendar__headline.getAttribute("data-month"))
			let year = parseInt(calendar__headline.getAttribute("data-year"))
			for (let i = 0; i < 42; i++) {
				calendar.removeChild(calendar.lastChild)
			}
			if (month == 11) {
				month = 0
				year = year + 1
			} else {
				month = month + 1
			}
			displayTime.displayMonthAndYear(month, year)
			displayTime.displayDays(month, year)
		})
	},
	dropdown() {
		const dropdown__schedule = DOMStrings.dropdown__schedule
		const options__schedule = DOMStrings.options__schedule
		const icon__schedule = DOMStrings.icon__schedule
		const text__schedule = DOMStrings.text__schedule
		const dropdown__weekday = DOMStrings.dropdown__weekday
		const options__weekday = DOMStrings.options__weekday
		const icon__weekday = DOMStrings.icon__weekday
		const text__weekday = DOMStrings.text__weekday
		function initializeDropdown(dropdown, options, icon, text) {
			dropdown.addEventListener("click", () => {
				options.dataset.visibility == "hidden"
					? menu.open(options, icon)
					: menu.close(options, icon)
			})
			Array.from(options.children).forEach((option) => {
				option.addEventListener("click", () => {
					text.innerText = option.innerText
					if (isWeekday(text.innerText)) {
						selections.weekday = text.innerText
					} else {
						selections.schedule = text.innerText
					}
					text.dataset.text = "active"
					menu.close(options, icon)
				})
			})
		}
		initializeDropdown(
			dropdown__schedule,
			options__schedule,
			icon__schedule,
			text__schedule
		)
		initializeDropdown(
			dropdown__weekday,
			options__weekday,
			icon__weekday,
			text__weekday
		)
	},
}

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
		]
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
		]
		const randomChoice = Math.floor(Math.random() * 20)
		const greeting__quote = DOMStrings.greeting__quote
		const greeting__author = DOMStrings.greeting__author
		greeting__quote.innerText = `"${quotes[randomChoice]}"`
		greeting__author.innerText = `${authors[randomChoice]}`
	},
}

const time = {
	getCurrentMonth() {
		const month = new Date().getMonth()
		return month
	},
	getCurrentYear() {
		const year = new Date().getFullYear()
		return year
	},
	getFirstWeekDay(month, year) {
		const weekday = new Date(year, month, 1).getDay()
		return weekday
	},
	getNumberOfDays(month, year) {
		const numberOfDays = new Date(year, month + 1, 0).getDate()
		return numberOfDays
	},
	getToday() {
		const today = new Date().getDate()
		return today
	},
	getHour() {
		const hour = new Date().getHours()
		return hour
	},
	getMinute() {
		const minute = new Date().getMinutes()
		return minute
	},
	getSecond() {
		const second = new Date().getSeconds()
		return second
	},
}

const displayTime = {
	displayMonthAndYear(month, year) {
		let calendar__headline = DOMStrings.calendar__headline
		calendar__headline.setAttribute("data-month", month)
		calendar__headline.setAttribute("data-year", year)
		switch (month) {
		case 0:
			month = "January"
			break
		case 1:
			month = "February"
			break
		case 2:
			month = "March"
			break
		case 3:
			month = "April"
			break
		case 4:
			month = "May"
			break
		case 5:
			month = "June"
			break
		case 6:
			month = "July"
			break
		case 7:
			month = "August"
			break
		case 8:
			month = "September"
			break
		case 9:
			month = "October"
			break
		case 10:
			month = "November"
			break
		case 11:
			month = "December"
			break
		}
		calendar__headline.innerText = `Your ${month} ${year}`
	},
	displayDays(month, year) {
		const weekday = time.getFirstWeekDay(month, year)
		const numberOfDays = time.getNumberOfDays(month, year)
		const numberOfDaysPrevious = time.getNumberOfDays(month - 1, year)
		const calendar = DOMStrings.calendar
		const today = time.getToday()
		let functionCounter = 0
		for (
			let i = numberOfDaysPrevious - weekday + 1;
			i <= numberOfDaysPrevious;
			i++, functionCounter++
		) {
			calendar.insertAdjacentHTML(
				"beforeend",
				`<a class="calendar__day--inactive">${i}</a>`
			)
		}
		for (let i = 1; i <= numberOfDays; i++, functionCounter++) {
			calendar.insertAdjacentHTML(
				"beforeend",
				`<a class="calendar__day">${i}</a>`
			)
			if (
				i == today &&
        month == time.getCurrentMonth() &&
        year == time.getCurrentYear()
			) {
				calendar.lastElementChild.classList = "calendar__day--container"
				calendar.lastElementChild.innerText = ""
				calendar.lastElementChild.innerHTML = `<p class="calendar__day calendar__day--today">${i}</p>`
			}
			
			for (let j = 0; j < store.dates.length; j++) {
				if (store.dates[j].year == year && store.dates[j].month == (month + 1) && store.dates[j].day == i) {
					calendar.lastElementChild.classList = "calendar__day--container--emphasized"
					calendar.lastElementChild.innerText = ""
					calendar.lastElementChild.innerHTML = `<p class="calendar__day calendar__day--emphasized">${i}</p>`
				}
			}
		}
		for (let i = 1; functionCounter < 42; i++, functionCounter++) {
			calendar.insertAdjacentHTML(
				"beforeend",
				`<a class="calendar__day--inactive">${i}</a>`
			)
		}
	},
	displayAnalogTime() {
		displayTime.displayAnalogTimeOnce()
		setInterval(displayTime.displayAnalogTimeOnce, timeouts.time)
	},
	displayAnalogTimeOnce() {
		const clock__hour = DOMStrings.clock__hour
		const clock__minute = DOMStrings.clock__minute
		const clock__second = DOMStrings.clock__second
    
		let hour = time.getHour() * 30
		let minute = time.getMinute() * 6
		let second = time.getSecond() * 6
		clock__hour.style.transform = `rotateZ(${hour + minute / 12}deg)`
		clock__minute.style.transform = `rotateZ(${minute}deg)`
		clock__second.style.transform = `rotateZ(${second}deg)`
	},
	displayDigitalTime() {
		displayTime.displayDigitalTimeOnce()
		setInterval(displayTime.displayDigitalTimeOnce, timeouts.time)
	},
	displayDigitalTimeOnce() {
		const alarms__digital = DOMStrings.alarms__digital
    
		let hour = time.getHour()
		let period
		if (hour == 0) {
			hour = 12
			period = "AM"
		} else if (hour < 12) {
			period = "AM"
		} else {
			hour = hour - 12
			period = "PM"
		}
		let minute = time.getMinute()
		if (hour == 0) {
			hour = 12
		}
		if (hour < 10) {
			hour = `0${hour}`
		}
		if (minute < 10) {
			minute = `0${minute}`
		}
    
		alarms__digital.innerText = `${hour}:${minute} ${period}`
	},
	async displayNextCourse() {
		let timeNow = luxon.DateTime.local()
		let targetReply = await timeOfNextPeriod()
    
		if (await targetReply == 0) {
			let targetReplyNext = await timeOfNextPeriodStart()
			let timeNext = truncatedTimeToDT(targetReplyNext)
			let timeUntilNext = await timeNext.diff(timeNow, "seconds").values.seconds
			createTimer(timeUntilNext, displayTime.displayNextCourse, "alarms__timer1", "hh:mm:ss")
			let currentCourse = await getCurrentCourse()
			if (!(await currentCourse)) {
				DOMStrings.alarms__title1.innerText = `Period ${await getCurrentPeriod()} starts`
			} else {
				DOMStrings.alarms__title1.innerText = `Period ${await getCurrentPeriod()} ${await currentCourse} starts`
			}
		} else if (!targetReply) {
			//::make a function that can tell if there have been classes today, and change title accordingly
			if (pages.events == 1) {
				DOMStrings.alarms__timer1.innerText = ""
				DOMStrings.alarms__title1.innerText = "No further classes scheduled for today."
			}
			//::classes will not update at midnight 
		} else {
			let targetTime = truncatedTimeToDT(targetReply)
			let timeUntilTarget = await targetTime.diff(timeNow, "seconds").values.seconds
			createTimer(timeUntilTarget, displayTime.displayNextCourse, "alarms__timer1", "hh:mm:ss")
			let currentCourse = await getCurrentCourse()
			if (!(await currentCourse)) {
				DOMStrings.alarms__title1.innerText = `Period ${await getCurrentPeriod()} ends`
			} else {
				DOMStrings.alarms__title1.innerText = `Period ${await getCurrentPeriod()} ${await currentCourse} ends`
			}
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
				break
			case 1:
				DOMTitle = DOMStrings.course__title2
				DOMSubtitle = DOMStrings.course__subtitle2
				DOMContainer = DOMStrings.course__container2
				break
			case 2:
				DOMTitle = DOMStrings.course__title3
				DOMSubtitle = DOMStrings.course__subtitle3
				DOMContainer = DOMStrings.course__container3
				break
			}
        
			if (nextCourseInfo[0] == 0) {
				document.getElementById("course__headline").style.display = "grid"
				DOMContainer.style.display = "flex"
				DOMTitle.innerText = await nextCourseInfo[1]
				DOMSubtitle.innerText = `${nextCourseInfo[2]}, ${nextCourseInfo[3]} — ${nextCourseInfo[4]}`
			} else {
				DOMContainer.style.display = "none"
			}
		}
	},
}

async function refreshCalendar() {
	const currentTime = luxon.DateTime.local()
	
	const eventsInfo = await getAllEvents()
	const tasksInfo = await getAllTasks()
	
	store.dates = []
    
	for (let i = 0; i < await eventsInfo.length; i++) {
		const currentObjDT = truncatedDateToDTUnformatted(await eventsInfo[i].dueDate)
		const timeDiff = currentObjDT.diff(currentTime, "days").values.days
		
		if (timeDiff > 0) {
			store.dates.push(currentObjDT)
		}
	}
    
	for (let i = 0; i < await tasksInfo.length; i++) {
		const currentObjDT = truncatedDateToDTUnformatted(await tasksInfo[i].dueDate)
		const timeDiff = currentObjDT.diff(currentTime, "days").values.days
		
		if (timeDiff > 0) {
			store.dates.push(currentObjDT)
		}
	}
	
	let month = parseInt(calendar__headline.getAttribute("data-month"))
	let year = parseInt(calendar__headline.getAttribute("data-year"))
	for (let i = 0; i < 42; i++) {
		calendar.removeChild(calendar.lastChild)
	}
	console.log(month, year)
	displayTime.displayMonthAndYear(month, year)
	displayTime.displayDays(month, year)
}

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

function truncatedTimeToDT(time) {
    
	let apm = time.split(" ")[1]
	let hour = time.split(":")[0]
	let minute = time.split(":")[1].split(" ")[0]
    
	let isPM
    
	if (apm == "PM" || apm == "pm" || apm == "pM" || apm == "Pm") {
		isPM = true
	} else {
		isPM = false
	}
    
	return convertToTime(hour, minute, isPM)
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
	if ((DOMStrings.alarms__title) && pages.events == 1) {
		DOMStrings.alarms__title1.innerText = "No further classes scheduled for today"
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
		
		const requestedPeriod = (currentPeriod + offset) //-1
		
		let requestedIndex
		
		for (let i = 0; i < await dayInfo.length; i++) {
			if (await dayInfo[i].period == requestedPeriod) {
				requestedIndex = i
				break
			} else {
				continue
			}
		}
		
		if (!(requestedIndex)) {
			requestedIndex = requestedPeriod - 1
		}
		
		const requestedCourse = dayInfo[requestedIndex]
		const requestedSchedulePeriod = scheduleInfo[requestedIndex]
        
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

function getDayInfoStatic(reqDay) {
	return axios.get(`/day/${reqDay}`, {timeout: timeouts.net})
		.then (function (response) {
			return response.data
		})
		.catch(function (error) {
			//console.log(error)
		})
}

function getFullDayInfo() {
	return axios.get("/day", {timeout: timeouts.net})
		.then (function (response) {
			return response.data
		})
		.catch(function (error) {
			//console.log(error)
		})
}

function getAllEvents() {
	return axios.get("/event", {timeout: timeouts.net})
		.then (function (response) {
			return response.data
		})
		.catch(function (error) {
			//console.log(error)
		})
}

function getAllTasks() {
	return axios.get("/task", {timeout: timeouts.net})
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

function getScheduleNameStatic(input) {
	return axios.get(`/day/schedule/${input}`, {timeout: timeouts.net})
		.then (function (response) {
			return response.data
		})
		.catch(function (error) {
			//console.log(error)
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
	return axios.get("/schedule", {timeout: timeouts.net})
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
		if (!(elementID == "alarms__timer1" && pages.events != 1)) {
			const durObj = luxon.Duration.fromObject({seconds: secs})
			const timeUntil = durObj.toFormat(format)
			document.getElementById(elementID).innerText = timeUntil
			secs--
			if (secs < 0) {
				clearInterval(intervalID)
				callback()
			}
		} else {
			clearInterval(intervalID)
		}
	}, timeouts.second)
}

function clearAllEvents(isPageOne) {
	document.getElementById("alarms__timer1").innerText = ""
	document.getElementById("alarms__title1").innerText = ""
	document.getElementById("alarms__timer2").innerText = ""
	document.getElementById("alarms__title2").innerText = ""
	document.getElementById("alarms__timer3").innerText = ""
	document.getElementById("alarms__title3").innerText = ""
	document.getElementById("alarms__module2").style.display = "none"
	document.getElementById("alarms__module3").style.display = "none"
    
	if (isPageOne) {
		document.getElementById("alarms__module1").style.display = "flex"
		displayTime.displayNextCourse()
	} else {
		document.getElementById("alarms__module1").style.display = "none"
	}
}

function insertEvent(position, title, subtitle) {
	switch (position) {
	case 1:
		document.getElementById("alarms__timer1").innerText = subtitle
		document.getElementById("alarms__title1").innerText = title
		document.getElementById("alarms__module1").style.display = "flex"
		break
	case 2:
		document.getElementById("alarms__timer2").innerText = subtitle
		document.getElementById("alarms__title2").innerText = title
		document.getElementById("alarms__module2").style.display = "flex"
		break
	case 3:
		document.getElementById("alarms__timer3").innerText = subtitle
		document.getElementById("alarms__title3").innerText = title
		document.getElementById("alarms__module3").style.display = "flex"
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
		document.getElementById("page__button__prev__plus").style = "background-color: silver"
	} else {
		document.getElementById("page__button__prev__plus").style -= "background-color: silver"
	}
    
	if (currentPage == totalPages) {
		document.getElementById("page__button__next__plus").style = "background-color: silver"
	} else {
		document.getElementById("page__button__next__plus").style -= "background-color: silver"
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
		document.getElementById("page__button__prev").style = "background-color: silver"
	} else {
		document.getElementById("page__button__prev").style -= "background-color: silver"
	}
    
	if (currentPage == totalPages) {
		document.getElementById("page__button__next").style = "background-color: silver"
	} else {
		document.getElementById("page__button__next").style -= "background-color: silver"
	}
    
	let id1
	let id2
	let id3
    
	setDisplayProperty("events__plus__container__back", "none")
	initDatePickers("events")
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
			document.getElementById("alarms__module1").style.animation = "shake 0.82s cubic-bezier(.36,.07,.19,.97) both"
			setTimeout(function() {
				document.getElementById("alarms__module1").style.animation -= "shake 0.82s cubic-bezier(.36,.07,.19,.97) both"
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
			refreshCalendar()
		})
		.catch(function (error) {
			//console.log(error)
		})
}

function deleteAccount() {
	axios.delete("/profile/delete/deletemyaccount/confirm")
		.then(async function(response) {
			window.location.href = "/auth/logout"
		})
		.catch(function (error) {
			//console.log(error)
		})
}

function expireOldEvents(eventsInfo) {
	for (let i = 0; i < eventsInfo.length; i++) {
		const currentObjDT = truncatedDateToDTUnformatted(eventsInfo[i].dueDate)
		const currentTime = luxon.DateTime.local()
		const timeDiff = currentObjDT.diff(currentTime, "days").values.days
        
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
	setTimeout(emphasizeEventDates(await eventsInfo), timeouts.delay) //waits for expires to happen
    
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
        
		document.getElementById("page__button__prev").style = "background-color: silver"
		document.getElementById("events__page__container").style.display = "flex"
        
	} else {
		document.getElementById("events__page__container").style.display = "none"
	}
    
	updateEventsPages(currentPage, totalPages, totalObjects, eventsArray)
}

function truncatedDateToFormattedDT(input) {
	const splitArray = input.split("-")
	const createdDate = luxon.DateTime.fromObject({ year: splitArray[0], month: splitArray[1], day: splitArray[2] })
	const formattedDate = createdDate.toFormat("EEEE, MMMM d")
    
	return formattedDate
}

function truncatedDateToDTUnformatted(input) {
	const splitArray = input.split("-")
	const createdDate = luxon.DateTime.fromObject({ year: splitArray[0], month: splitArray[1], day: splitArray[2] })
    
	return createdDate
}

function emphasizeEventDates(eventsInfo) {
	const currentTime = luxon.DateTime.local()
    
	for (let i = 0; i < eventsInfo.length; i++) {
		const currentObjDT = truncatedDateToDTUnformatted(eventsInfo[i].dueDate)
		const timeDiff = currentObjDT.diff(currentTime, "days").values.days
		
		if (timeDiff > 0) {
			store.dates.push(currentObjDT)
		}
	}
	
	for (let i = 0; i < 42; i++) {
		calendar.removeChild(calendar.lastChild)
	}
	
	displayTime.displayDays(parseInt(calendar__headline.getAttribute("data-month")), parseInt(calendar__headline.getAttribute("data-year")))
}

function clearAllTasks() {
	document.getElementById("tasks__title1").innerText = ""
	document.getElementById("tasks__title2").innerText = ""
	document.getElementById("tasks__title3").innerText = ""
	document.getElementById("tasks__title4").innerText = ""
	document.getElementById("tasks__subtitle1").innerText = ""
	document.getElementById("tasks__subtitle2").innerText = ""
	document.getElementById("tasks__subtitle3").innerText = ""
	document.getElementById("tasks__subtitle4").innerText = ""
	document.getElementById("tasks__container1").style.display = "none"
	document.getElementById("tasks__container2").style.display = "none"
	document.getElementById("tasks__container3").style.display = "none"
	document.getElementById("tasks__container4").style.display = "none"
}

function insertTask(position, subtitle, title) {
	switch (position) {
	case 1:
		document.getElementById("tasks__title1").innerText = title
		document.getElementById("tasks__subtitle1").innerText = subtitle
		document.getElementById("tasks__container1").style.display = "flex"
		break
	case 2:
		document.getElementById("tasks__title2").innerText = title
		document.getElementById("tasks__subtitle2").innerText = subtitle
		document.getElementById("tasks__container2").style.display = "flex"
		break
	case 3:
		document.getElementById("tasks__title3").innerText = title
		document.getElementById("tasks__subtitle3").innerText = subtitle
		document.getElementById("tasks__container3").style.display = "flex"
		break
		/*
	case 4:
		document.getElementById("tasks__title4").innerText = title
		document.getElementById("tasks__subtitle4").innerText = subtitle
		document.getElementById("tasks__container4").style.display = "flex"
		break
		*/
	}
}

function getTaskIndexFromPage(page) {
	return ((page - 1) * 3)
}

function updateTasksPages(currentPage, totalPages, totalObjects, tasksArray) {
	pages.tasks = currentPage
    
	if (currentPage == 1) {
		document.getElementById("task__button__prev").style = "background-color: silver"
	} else {
		document.getElementById("task__button__prev").style -= "background-color: silver"
	}
    
	if (currentPage == totalPages) {
		document.getElementById("task__button__next").style = "background-color: silver"
	} else {
		document.getElementById("task__button__next").style -= "background-color: silver"
	}
    
	let id1
	let id2
	let id3
	let id4
    
	clearAllTasks()
	setDisplayProperty("tasks__plus__container__back", "none")
	initDatePickers("tasks")
    
	if (currentPage == 1) {
		try {
			for (let i = 0; i < 3; i++) {
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
					/*
				case 3:
					id4 = tasksArray[i][2]
					break
					*/
				}
			}
		} catch (err) {
			//console.log(err)
		}
	} else {
		clearAllTasks(false)
		try {
            
			if (!(currentPage == totalPages && !(tasksArray[getTaskIndexFromPage(currentPage)]))) {
            
				for (let i = 0; i < 3; i++) {
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
						/*
					case 3:
						id4 = tasksArray[currentIndex][2]
						break
						*/
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
			refreshCalendar()
		})
		.catch(function (error) {
			//console.log(error)
		})
}

function expireOldTasks(tasksInfo) {
	//this function is not currently used as it may be destructure
	//left just in case we later wish to reimplement it
	for (let i = 0; i < tasksInfo.length; i++) {
		const currentObjDT = truncatedDateToDTUnformatted(tasksInfo[i].dueDate)
		const currentTime = luxon.DateTime.local()
		const timeDiff = currentObjDT.diff(currentTime, "days").values.days
        
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
    
	if (totalObjects == 4) {
		totalPages = 1
	} else {
		totalPages = Math.ceil(totalObjects / 3)
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
    
	if (totalObjects > 4) {
        
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
        
		document.getElementById("task__button__prev").style = "background-color: silver"
		document.getElementById("task__page__container").style.display = "flex"
        
	} else {
		document.getElementById("task__page__container").style.display = "none"
	}
    
	updateTasksPages(currentPage, totalPages, totalObjects, tasksArray)
}

function initDatePickers(givenName) {
	let timeNow = luxon.DateTime.local()
	let timeNowFormatted = timeNow.toFormat("LL/dd/yyyy")
    
	if (givenName == "tasks") {
		document.getElementById("tasks__plus__date__input").value = timeNowFormatted
		document.getElementById("tasks__plus__task__input").value = ""
		document.getElementById("tasks__plus__course__input").value = ""
		document.getElementById("tasks__plus__container__error").innerText = ""
	} else if (givenName == "events") {
		document.getElementById("events__plus__date__input").value = timeNowFormatted
		document.getElementById("events__plus__event__input").value = ""
		document.getElementById("events__plus__course__input").value = ""
		document.getElementById("events__plus__container__error").innerText = ""
	} else {
		document.getElementById("tasks__plus__date__input").value = timeNowFormatted
		document.getElementById("tasks__plus__task__input").value = ""
		document.getElementById("tasks__plus__course__input").value = ""
		document.getElementById("tasks__plus__container__error").innerText = ""
		document.getElementById("events__plus__date__input").value = timeNowFormatted
		document.getElementById("events__plus__event__input").value = ""
		document.getElementById("events__plus__course__input").value = ""
		document.getElementById("events__plus__container__error").innerText = ""
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
		initDatePickers("tasks")
	}
    
	document.getElementById("plus__container__event").onclick = function () {
		setDisplayProperty("plus__container__event", "none")
		setDisplayProperty("events__plus__container__back", "flex")
	}
    
	document.getElementById("events__plus__container--icon--cross").onclick = function () {
		setDisplayProperty("events__plus__container__back", "none")
		setDisplayProperty("plus__container__event", "flex")
		initDatePickers("events")
	}
    
	document.getElementById("tasks__plus__container--icon").onclick = function () {
        
		if (document.getElementById("tasks__plus__task__input").value != "" && document.getElementById("tasks__plus__date__input").value) {
			let dateFormatted
            
			try {
				const inputDateArray = document.getElementById("tasks__plus__date__input").value.split("/")
                
				if (!(inputDateArray[0]) || !(inputDateArray[1]) || !(inputDateArray[2])) {
					throw new Error("Please enter a valid date")
				}
                
				dateFormatted = `${inputDateArray[2]}-${inputDateArray[0]}-${inputDateArray[1]}`
                
				if (truncatedDateToFormattedDT(dateFormatted) == "Invalid DateTime") {
					throw new Error("Please enter a valid date")
				}
                
				try {
					axios.post("/task/upload", {
						name: document.getElementById("tasks__plus__task__input").value,
						course: document.getElementById("tasks__plus__course__input").value,
						dueDate: dateFormatted
					})
						.then (function (response) {
							//console.log(response)
							updateTasks(99999) //putting 99999 essentially forces update to last page
							
						})
						.catch(function (error) {
							//console.log(err)
						})
				} catch (err) {
					//console.log(err)
				}
                
				setDisplayProperty("tasks__plus__container__back", "none")
				setDisplayProperty("tasks__plus__container", "flex")
				initDatePickers("tasks")
                
			} catch (err) {
				document.getElementById("tasks__plus__container__error").innerText = "Please enter a valid date"
				//console.log(err)
			}
		} else if (document.getElementById("tasks__plus__task__input").value == "" && document.getElementById("tasks__plus__date__input").value == "") {
			document.getElementById("tasks__plus__container__error").innerText = "Please enter a task name and due date"
		} else if (document.getElementById("tasks__plus__task__input").value == "") {
			document.getElementById("tasks__plus__container__error").innerText = "Please enter a task name"
		} else if (document.getElementById("tasks__plus__date__input").value == "") {
			document.getElementById("tasks__plus__container__error").innerText = "Please enter a due date"
		} else {
			document.getElementById("tasks__plus__container__error").innerText = "Please enter a valid date"
		}
	}
    
	document.getElementById("events__plus__container--icon").onclick = function () {
        
		let pastDate = false
        
		if (document.getElementById("events__plus__event__input").value != "" && document.getElementById("events__plus__date__input").value) {
			let dateFormatted
            
			try {
				const inputDateArray = document.getElementById("events__plus__date__input").value.split("/")
                
				if (!(inputDateArray[0]) || !(inputDateArray[1]) || !(inputDateArray[2])) {
					throw new Error("Please enter a valid date")
				}
                
				dateFormatted = `${inputDateArray[2]}-${inputDateArray[0]}-${inputDateArray[1]}`
                
				if (truncatedDateToFormattedDT(dateFormatted) == "Invalid DateTime") {
					throw new Error("Please enter a valid date")
				}
                
				const currentObjDT = truncatedDateToDTUnformatted(dateFormatted)
				const currentTime = luxon.DateTime.local()
				const timeDiff = currentObjDT.diff(currentTime, "days").values.days
                
				if (timeDiff < -1) {
					pastDate = true
					throw new Error("Please enter a future or present date")
				}
                
				try {
					axios.post("/event/upload", {
						name: document.getElementById("events__plus__event__input").value,
						course: document.getElementById("events__plus__course__input").value,
						dueDate: dateFormatted
					})
						.then (function (response) {
							//console.log(response)
							pages.eventsPlus = 1
							updateEventsPlusPages()
							
							updateEvents(99999) //putting 99999 essentially forces update to last page
						})
						.catch(function (error) {
							//console.log(err)
						})
                
					setDisplayProperty("events__plus__container__back", "none")
					setDisplayProperty("plus__container__event", "flex")
					initDatePickers("events")
                    
				} catch (err) {
					//console.log(err)
					if (pastDate) {
						document.getElementById("events__plus__container__error").innerText = "Please enter a future or present date"
					} else {
						document.getElementById("events__plus__container__error").innerText = "Please enter a valid date"
					}
				}
                
			} catch (err) {
				//console.log(err)
				if (pastDate) {
					document.getElementById("events__plus__container__error").innerText = "Please enter a future or present date"
				} else {
					document.getElementById("events__plus__container__error").innerText = "Please enter a valid date"
				}
			}
		} else if (document.getElementById("events__plus__event__input").value == "" && document.getElementById("events__plus__date__input").value == "") {
			document.getElementById("events__plus__container__error").innerText = "Please enter an event name and due date"
		} else if (document.getElementById("events__plus__event__input").value == "") {
			document.getElementById("events__plus__container__error").innerText = "Please enter an event name"
		} else if (document.getElementById("events__plus__date__input").value == "") {
			document.getElementById("events__plus__container__error").innerText = "Please enter a due date"
		} else {
			document.getElementById("events__plus__container__error").innerText = "Please enter a valid date"
		}
	}
}

async function getNewQuote() {
	return axios.get("https://quote-garden.herokuapp.com/api/v2/quotes/random", {timeout: timeouts.net})
		.then (function (response) {
			return response.data
		})
		.catch(function (error) {
			greeting.display()
		})
}

async function applyNewQuote() {
	DOMStrings.greeting__update__title.innerText = updates.title
	DOMStrings.greeting__update__subtitle.innerText = updates.subtitle
	try {
		const response = await getNewQuote()
		const quoteAuthor = await response.quote.quoteAuthor
		const quoteText = await response.quote.quoteText
		DOMStrings.greeting__quote.innerText = await quoteText
		if (await quoteAuthor) {
			DOMStrings.greeting__author.innerText = await quoteAuthor
		} else {
			DOMStrings.greeting__author.innerText = "Unknown"
		}
	} catch (err) {
		greeting.display()
	}
}

function loginSwitchTo(page) {
	document.getElementById("login__switcher").style.animation = ""
	document.getElementById("login__switcher").style.animation = "fadeOut 0.6s ease-in-out"
	setTimeout(() => {
		document.getElementById("login__switcher").style.animation = ""
		let newMessage
		switch (page) {
		case 1:
			newMessage = "a complete suite of student organization tools"
			break
		case 2:
			newMessage = "a planner to keep track of your events and tasks"
			break
		case 3:
			newMessage = "a dashboard to monitor the time you spend in class"
			break
		case 4:
			newMessage = "a look into the rest of your day"
			break
		case 5:
			newMessage = "a versatile tool to help you manage your school life"
			break
		}
		document.getElementById("login__switcher").innerText = newMessage
		document.getElementById("login__switcher").style.animation = "fadeIn 0.6s ease-in-out"
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

function setMidnightTimer() {
	const today = new Date()
	const tommorow = new Date(today.getFullYear(),today.getMonth(),today.getDate()+1)
	const timeToMidnight = (tommorow-today)
	setTimeout(function(){
		refreshDocument()
	}, timeToMidnight);
}

function setupDashboardPage() {
	displayTime.displayMonthAndYear(time.getCurrentMonth(), time.getCurrentYear()) 
	displayTime.displayDays(time.getCurrentMonth(), time.getCurrentYear())
	displayTime.displayAnalogTime()
	displayTime.displayDigitalTime()
	eventListeners.calendarNavigation()
	
	setMidnightTimer()
	applyNewQuote()
	updateEvents(false)
	updateTasks(false)
	initPlusButtons()
}

function setupLoginPage() {
	loginSwitcher()
}

function refreshDocument() {
	location.reload()
}

function createSchedule(scheduleName, elementID) {
	axios.post("/schedule/upload", {
		name: scheduleName
	})
		.then (function (response) {
			document.getElementById(elementID).innerText = "Schedule created."
			refreshDocument()
		})
		.catch(function (error) {
			document.getElementById(elementID).innerText = "Please enter an unused name under 32 characters."
		})
}

function createFeedback(feedback) {
	axios.post("/feedback/upload", {
		name: feedback
	})
		.then (function (response) {
			document.getElementById("settings__feedback__text").innerText = "Feedback sent!"
		})
		.catch(function (error) {
			document.getElementById("settings__feedback__text").innerText = "Network error."
		})
}

function isWeekday(input) {
	if (input == "Monday" || input == "Tuesday" || input == "Wednesday" || input == "Thursday" || input == "Friday" || input == "Saturday" || input == "Sunday") {
		return true
	} else {
		return false
	}
}

function dayNameToNumber(input) {
	switch (input) {
	case "Monday":
		return 0
	case "Tuesday":
		return 1
	case "Wednesday":
		return 2
	case "Thursday":
		return 3
	case "Friday":
		return 4
	case "Saturday":
		return 5
	case "Sunday":
		return 6
	default:
		throw new Error("Not a valid weekday")
	}
}

function dayNumberToName(input) {
	switch (input) {
	case 0:
		return "Monday"
	case 1:
		return "Tuesday"
	case 2:
		return "Wednesday"
	case 3:
		return "Thursday"
	case 4:
		return "Friday"
	case 5:
		return "Saturday"
	case 6:
		return "Sunday"
	default:
		throw new Error("Not a valid day number")
	}
}

function createDay(dayNumber, schedule, elementID) {
	axios.post("/day/upload", {
		day: dayNumber,
		schedule: schedule
	})
		.then (function (response) {
			document.getElementById(elementID).innerText = "Schedule applied."
			refreshDocument()
		})
		.catch(function (error) {
			document.getElementById(elementID).innerText = "Schedule not applied due to a network error."
			//console.log(error)
		})
}

function createElementFromHTML(htmlString) {
	var div = document.createElement("div")
	div.innerHTML = htmlString.trim()
	return div.firstChild 
}

function updateSchedulesPlusPages() {
	let currentPage = pages.schedulesPlus
	let totalPages = 3
    
	if (currentPage == 1) {
		document.getElementById("page__button__prev__plus__schedule").style = "background-color: silver"
	} else {
		document.getElementById("page__button__prev__plus__schedule").style -= "background-color: silver"
	}
    
	if (currentPage == totalPages) {
		document.getElementById("page__button__next__plus__schedule").style = "background-color: silver"
	} else {
		document.getElementById("page__button__next__plus__schedule").style -= "background-color: silver"
	}
    
	switch (currentPage) {
	case 1:
		setDisplayProperty("material__group1__schedule", "block")
		setDisplayProperty("material__group2__schedule", "none")
		setDisplayProperty("material__group3__schedule", "none")
		break
	case 2:
		setDisplayProperty("material__group1__schedule", "none")
		setDisplayProperty("material__group2__schedule", "block")
		setDisplayProperty("material__group3__schedule", "none")
		break
	case 3:
		setDisplayProperty("material__group1__schedule", "none")
		setDisplayProperty("material__group2__schedule", "none")
		setDisplayProperty("material__group3__schedule", "block")
		break
	}
}

function validateTimeAPM(apm) {
	if (apm == "am" || apm == "Am" || apm == "aM" || apm == "AM") {
		return true
	} else if (apm == "pm" || apm == "Pm" || apm == "pM" || apm == "PM") {
		return true
	} else {
		return false
	}
}

async function validateSchedulePlus() {
	if (document.getElementById("material__group1__schedule__input").value != "" && document.getElementById("material__group2__schedule__input").value != "" && document.getElementById("material__group3__schedule__input").value != "") {
        
		if (!(validateTimeAPM(document.getElementById("material__group2__schedule__input").value.split(":")[1].split(" ")[1]))) {
			console.log("Error: given bad AM/PM for start time")
			return false
		} else if (!(validateTimeAPM(document.getElementById("material__group3__schedule__input").value.split(":")[1].split(" ")[1]))) {
			console.log("Error: given bad AM/PM for end time")
			return false
		}
        
		const startTime = truncatedTimeToDT(document.getElementById("material__group2__schedule__input").value)
		if (!(startTime.isValid)) {
			console.log("Error: given invalid start time value")
			return false
		}
        
		const endTime = truncatedTimeToDT(document.getElementById("material__group3__schedule__input").value)
		if (!(endTime.isValid)) {
			console.log("Error: given invalid end time value")
			return false
		}
        
		if (startTime.diff(endTime, "minutes").values.minutes >= 0) {
			console.log("Error: end time is before start time")
			return false
		}
        
		const scheduleInfo = await getScheduleInfo(selections.scheduleTitle)
        
		for (let i = 0; i < await scheduleInfo.length; i++) {
			if (startTime.diff(truncatedTimeToDT(await scheduleInfo[i].timeEnd), "minutes").values.minutes < 0 && await scheduleInfo[i].period < document.getElementById("material__group1__schedule__input").value ) {
				console.log("Error: given bad start time. Periods are not allowed to start earlier than later periods.")
				return false
			}
		}
        
		for (let i = 0; i < await scheduleInfo.length; i++) {
			if (endTime.diff(truncatedTimeToDT(await scheduleInfo[i].timeStart), "minutes").values.minutes > 0 && await scheduleInfo[i].period > document.getElementById("material__group1__schedule__input").value ) {
				console.log("Error: given bad end time. Periods are not allowed to end later than earlier periods.")
				return false
			}
		}
        
		return true
	} else {
		return false
	}
}

function clearSchedulePlusButtons() {
	document.getElementById("material__group1__schedule__input").value = ""
	document.getElementById("material__group2__schedule__input").value = ""
	document.getElementById("material__group3__schedule__input").value = ""
}

function clearDayPlusButtons() {
	document.getElementById("material__group1__course__input").value = ""
	document.getElementById("material__group2__course__input").value = ""
}

function initCoursesPlusButtons() {
	updateSchedulesPlusPages()
    
	document.getElementById("page__button__prev__plus__schedule").onclick = function () {
		if (pages.schedulesPlus != 1) {
			pages.schedulesPlus--
			updateSchedulesPlusPages()
		}
	}
    
	document.getElementById("page__button__next__plus__schedule").onclick = function () {
		if (pages.schedulesPlus != 3) {
			pages.schedulesPlus++
			updateSchedulesPlusPages()
		}
	}
    
	document.getElementById("schedules__plus__container__front").onclick = function () {
		setDisplayProperty("schedules__plus__container__front", "none")
		setDisplayProperty("schedules__plus__container__back", "flex")
		updateSchedulesPlusPages()
	}
    
	document.getElementById("schedules__plus__container--icon--cross").onclick = function () {
		setDisplayProperty("schedules__plus__container__back", "none")
		setDisplayProperty("schedules__plus__container__front", "flex")
		clearSchedulePlusButtons()
		pages.schedulesPlus = 1
		updateSchedulesPlusPages()
	}
    
	document.getElementById("schedules__plus__container--icon").onclick = async function () {
        
		if (await validateSchedulePlus()) {
			axios.post("/schedule/period/upload", {
				forSchedule: selections.scheduleTitle,
				period: document.getElementById("material__group1__schedule__input").value,
				timeStart: document.getElementById("material__group2__schedule__input").value,
				timeEnd: document.getElementById("material__group3__schedule__input").value
			})
				.then (function (response) {
					setDisplayProperty("schedules__plus__container__back", "none")
					setDisplayProperty("schedules__plus__container__front", "flex")
					clearSchedulePlusButtons()
					updateScheduleDisplay(selections.scheduleTitle, pages.scheduleSubmenu)
				})
				.catch(function (error) {
					//console.log(error)
				})
		} else {
			throw new Error("Please fill out all fields properly")
		}
	}
}

function updateDaysPlusPages() {
	let currentPage = pages.coursesPlus
	let totalPages = 2
    
	if (currentPage == 1) {
		document.getElementById("page__button__prev__plus__course").style = "background-color: silver"
	} else {
		document.getElementById("page__button__prev__plus__course").style -= "background-color: silver"
	}
    
	if (currentPage == totalPages) {
		document.getElementById("page__button__next__plus__course").style = "background-color: silver"
	} else {
		document.getElementById("page__button__next__plus__course").style -= "background-color: silver"
	}
    
	switch (currentPage) {
	case 1:
		setDisplayProperty("material__group1__course", "block")
		setDisplayProperty("material__group2__course", "none")
		break
	case 2:
		setDisplayProperty("material__group1__course", "none")
		setDisplayProperty("material__group2__course", "block")
		break
	}
}

async function validateDayPlus() {
	if (document.getElementById("material__group1__course__input").value != "" && document.getElementById("material__group2__course__input").value != "") {
        
		const scheduleInfo = await getScheduleInfo(await getScheduleNameStatic(dayNameToNumber(selections.dayTitle)))
        
		let hasMatchingPeriod = false
        
		for (let i = 0; i < await scheduleInfo.length; i++) {
			if (await scheduleInfo[i].period == document.getElementById("material__group1__course__input").value) {
				hasMatchingPeriod = true
				break
			} else {
				continue
			}
		}
        
		if (!(hasMatchingPeriod)) {
			console.log("Error: no period information exists in schedule for given course")
		}
        
		return hasMatchingPeriod
	} else {
		return false
	}
}

function initDaysPlusButtons() {
	updateDaysPlusPages()
    
	document.getElementById("page__button__prev__plus__course").onclick = function () {
		if (pages.coursesPlus != 1) {
			pages.coursesPlus--
			updateDaysPlusPages()
		}
	}
    
	document.getElementById("page__button__next__plus__course").onclick = function () {
		if (pages.coursesPlus != 2) {
			pages.coursesPlus++
			updateDaysPlusPages()
		}
	}
    
	document.getElementById("courses__plus__container__front").onclick = function () {
		setDisplayProperty("courses__plus__container__front", "none")
		setDisplayProperty("courses__plus__container__back", "flex")
		updateDaysPlusPages()
	}
    
	document.getElementById("courses__plus__container--icon--cross").onclick = function () {
		setDisplayProperty("courses__plus__container__back", "none")
		setDisplayProperty("courses__plus__container__front", "flex")
		clearDayPlusButtons()
		pages.coursesPlus = 1
		updateDaysPlusPages()
	}
    
	document.getElementById("courses__plus__container--icon").onclick = async function () {
        
		if (await validateDayPlus()) {
			axios.post("/course/upload", {
				forDay: dayNameToNumber(selections.dayTitle),
				period: document.getElementById("material__group1__course__input").value,
				name: document.getElementById("material__group2__course__input").value
			})
				.then (function (response) {
					setDisplayProperty("courses__plus__container__back", "none")
					setDisplayProperty("courses__plus__container__front", "flex")
					clearDayPlusButtons()
					updateCourseDisplay(selections.dayTitle, pages.courseSubmenu)
				})
				.catch(function (error) {
					//console.log(error)
				})
		} else {
			throw new Error("Please fill out all fields properly")
		}
	}
}

async function initCourseMainButtons() {
	let fullScheduleInfo = await getFullScheduleInfo()
    
	for (let i = 0; i < await fullScheduleInfo.length; i++) {
		document.getElementById("options__schedule").appendChild(
			createElementFromHTML(`<div class="courses__option"> <p class="courses__text--alternative">${await fullScheduleInfo[i].name}</p> </div>`)
		)
	}
    
	eventListeners.dropdown()
	initCoursesPlusButtons()
	initDaysPlusButtons()
    
	document.getElementById("courses__button__apply").onclick = async function () {
		if (selections.schedule != "" && selections.weekday != "") {
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
						createDay(day, schedule, "courses__text__apply")
					})
					.catch(function (error) {
						//console.log(error)
					})
			} else {
				createDay(day, schedule, "courses__text__apply")
			}
            
		}
	}
    
	document.getElementById("courses__button__create").onclick = function () {
		const scheduleName = document.getElementById("course__input__create").value
        
		if (scheduleName) {
			createSchedule(scheduleName, "courses__text__create")
			initScheduleDisplay()
		}
	}
}

function deletePeriod(input) {
	axios.delete(`/schedule/period/byID/${input}`)
		.then(async function(response) {
			updateScheduleDisplay(selections.scheduleTitle, pages.scheduleSubmenu)
		})
		.catch(function (error) {
			//console.log(error)
		})
}

function insertToScheduleDisplay(position, info) {
	setDisplayProperty(`courses__container${position}`, "flex")
	document.getElementById(`courses__title${position}`).innerText = `Period ${info.period}`
	document.getElementById(`courses__subtitle${position}`).innerText = `${info.timeStart} — ${info.timeEnd}`
	switch(position) {
	case 1:
		store.period1 = info._id
		break
	case 2:
		store.period2 = info._id
		break
	case 3:
		store.period3 = info._id
		break
	case 4:
		store.period4 = info._id
		break
	case 5:
		store.period5 = info._id
		break
	case 6:
		store.period6 = info._id
		break
	case 7:
		store.period7 = info._id
		break
	case 8:
		store.period8 = info._id
		break
	case 9:
		store.period9 = info._id
		break
	}
}

function getTotalSubpages(itemCount) {
	let subpages = 1
    
	if (itemCount < 9) {
		return subpages
	}
    
	while (((subpages * 9) - 2) <= itemCount) {
		subpages++
	}
    
	return subpages
}

function clearScheduleDisplay() {
	for (let i = 1; i < 10; i++) {
		setDisplayProperty(`courses__container${i}`, "none")
		document.getElementById(`courses__subtitle${i}`).innerText = ""
		document.getElementById(`courses__title${i}`).innerText = ""
	}
	setDisplayProperty("schedules__plus__container__back", "none")
	setDisplayProperty("schedules__plus__container__front", "none")
	setDisplayProperty("plus__container__schedule", "none")
	clearSchedulePlusButtons()
}

async function updateScheduleDisplay(schName, reqPage) {
	clearScheduleDisplay()
	pages.schedulesPlus = 1
	updateSchedulesPlusPages()
    
	const scheduleInfo = await getScheduleInfo(schName)
    
	document.getElementById("schedule__headline").innerText = `Schedule ${schName}`
	selections.scheduleTitle = schName
    
	if (!(reqPage)) {
		reqPage = 1
	}
    
	const totalPages = getTotalSubpages(await scheduleInfo.length)
    
	pages.scheduleSubmenu = reqPage
    
	if (await scheduleInfo.length > 8) {
		let currentWorkID = 1
        
		for (let i = (((reqPage * 9) - 9) - (reqPage - 1)); i < ((reqPage * 9) - reqPage); i++) {
			if (await scheduleInfo[i]) {
				insertToScheduleDisplay((currentWorkID), await scheduleInfo[i])
				currentWorkID++
			}
			setDisplayProperty("schedules__plus__container__front", "none")
			setDisplayProperty("schedules__plus__container__back", "none")
			setDisplayProperty("plus__container__schedule", "flex")
		}
        
		if (reqPage == totalPages) { //1+
			setDisplayProperty("schedules__plus__container__front", "flex")
		}
	} else {
		for (let i = 0; i < await scheduleInfo.length; i++) {
			insertToScheduleDisplay((i + 1), await scheduleInfo[i])
		}
		setDisplayProperty("schedules__plus__container__front", "flex")
	}
    
	if (reqPage == 1) {
		document.getElementById("plus__container__schedule__left").style = "background-color: silver"
	} else {
		document.getElementById("plus__container__schedule__left").style -= "background-color: silver"
	}
    
	if (reqPage == totalPages) {
		document.getElementById("plus__container__schedule__right").style = "background-color: silver"
	} else {
		document.getElementById("plus__container__schedule__right").style -= "background-color: silver"
	}
    
	document.getElementById("plus__container__schedule__left").onclick = function () {
		if (reqPage != 1) {
			updateScheduleDisplay(schName, (reqPage - 1))
		}
	}
    
	document.getElementById("plus__container__schedule__right").onclick = function () {
		if (reqPage < totalPages) {
			updateScheduleDisplay(schName, (reqPage + 1))
		}
	}
}

function deleteCurrentSchedule() {
	if (document.getElementById("schedule__headline").innerText == "No schedules") {
		document.getElementById("nav__scheduleDelete").style.animation = "shake 0.82s cubic-bezier(.36,.07,.19,.97) both"
		setTimeout(function() {
			document.getElementById("nav__scheduleDelete").style.animation -= "shake 0.82s cubic-bezier(.36,.07,.19,.97) both"
		}, timeouts.animation)
		return
	}
    
	const nameToDelete = pages.scheduleStore[(pages.schedules - 1)]
    
	axios.delete(`/schedule/${nameToDelete}`)
		.then(async function(response) {
			refreshDocument()
		})
		.catch(function (error) {
			//console.log(error)
		})
}

function deleteCurrentDay() {
	if (document.getElementById("course__headline").innerText == "No days configured") {
		document.getElementById("nav__courseDelete").style.animation = "shake 0.82s cubic-bezier(.36,.07,.19,.97) both"
		setTimeout(function() {
			document.getElementById("nav__courseDelete").style.animation -= "shake 0.82s cubic-bezier(.36,.07,.19,.97) both"
		}, timeouts.animation)
		return
	}
    
	const nameToDelete = dayNameToNumber(pages.courseStore[(pages.courses - 1)])
    
	axios.delete(`/day/${nameToDelete}`)
		.then(async function(response) {
			refreshDocument()
		})
		.catch(function (error) {
			//console.log(error)
		})
}

function deleteCourse(input) {
	axios.delete(`/course/byID/${input}`)
		.then(async function(response) {
			updateCourseDisplay(selections.dayTitle, pages.courseSubmenu)
		})
		.catch(function (error) {
			//console.log(error)
		})
}

async function initScheduleDisplay() {
	const scheduleFullInfo = await getFullScheduleInfo()
    
	document.getElementById("nav__scheduleDelete").onclick = function () {
		deleteCurrentSchedule()
	}
    
	if (await scheduleFullInfo.length == 0) {
		document.getElementById("schedule__headline").innerText = "No schedules"
		return
	}
    
	for (let i = 0; i < await scheduleFullInfo.length; i++) {
		pages.scheduleStore.push(await scheduleFullInfo[i].name)
	}
    
	updateScheduleDisplay(pages.scheduleStore[0])
    
    
	if (await scheduleFullInfo.length > 1) {
		document.getElementById("nav__scheduleRight").dataset.active = true
		document.getElementById("nav__scheduleLeft").dataset.active = true
    
		document.getElementById("nav__scheduleLeft").onclick = async function () {
			pages.schedules--
			if (pages.schedules < 1) {
				pages.schedules = await scheduleFullInfo.length
			}
			updateScheduleDisplay(pages.scheduleStore[(pages.schedules - 1)])
		}
        
		document.getElementById("nav__scheduleRight").onclick = async function () {
			pages.schedules++
			if (pages.schedules > await scheduleFullInfo.length) {
				pages.schedules = 1
			}
			updateScheduleDisplay(pages.scheduleStore[(pages.schedules - 1)])
		}
	} else if (await scheduleFullInfo.length == 0) {
		document.getElementById("schedule__headline").innerText = "No schedules"
	}
    
	document.getElementById("courses__container1__button").onclick = function () {
		deletePeriod(store.period1)
	}
    
	document.getElementById("courses__container2__button").onclick = function () {
		deletePeriod(store.period2)
	}
    
	document.getElementById("courses__container3__button").onclick = function () {
		deletePeriod(store.period3)
	}
    
	document.getElementById("courses__container4__button").onclick = function () {
		deletePeriod(store.period4)
	}
    
	document.getElementById("courses__container5__button").onclick = function () {
		deletePeriod(store.period5)
	}
    
	document.getElementById("courses__container6__button").onclick = function () {
		deletePeriod(store.period6)
	}
    
	document.getElementById("courses__container7__button").onclick = function () {
		deletePeriod(store.period7)
	}
    
	document.getElementById("courses__container8__button").onclick = function () {
		deletePeriod(store.period8)
	}
    
	document.getElementById("courses__container9__button").onclick = function () {
		deletePeriod(store.period9)
	}
}

function insertToCourseDisplay(position, info) {
	setDisplayProperty(`days__container${position}`, "flex")
	document.getElementById(`days__title${position}`).innerText = info.name
	document.getElementById(`days__subtitle${position}`).innerText = `Period ${info.period}`
	switch(position) {
	case 1:
		store.course1 = info._id
		break
	case 2:
		store.course2 = info._id
		break
	case 3:
		store.course3 = info._id
		break
	case 4:
		store.course4 = info._id
		break
	case 5:
		store.course5 = info._id
		break
	case 6:
		store.course6 = info._id
		break
	case 7:
		store.course7 = info._id
		break
	case 8:
		store.course8 = info._id
		break
	case 9:
		store.course9 = info._id
		break
	}
}

function clearCourseDisplay() {
	for (let i = 1; i < 10; i++) {
		setDisplayProperty(`days__container${i}`, "none")
		document.getElementById(`days__subtitle${i}`).innerText = ""
		document.getElementById(`days__title${i}`).innerText = ""
	}
	setDisplayProperty("courses__plus__container__back", "none")
	setDisplayProperty("courses__plus__container__front", "none")
	setDisplayProperty("plus__container__day", "none")
	clearDayPlusButtons()
}

async function updateCourseDisplay(dayName, reqPage) {
	clearCourseDisplay()
	pages.coursesPlus = 1
	updateDaysPlusPages()
    
	const dayInfo = await getDayInfoStatic(dayNameToNumber(dayName))
    
	document.getElementById("course__headline").innerText = `${dayName}'s Courses`
	selections.dayTitle = dayName
    
	if (!(reqPage)) {
		reqPage = 1
	}
    
	const totalPages = getTotalSubpages(await dayInfo.length)
    
	pages.courseSubmenu = reqPage
    
	if (await dayInfo.length > 8) {
		let currentWorkID = 1
        
		for (let i = (((reqPage * 9) - 9) - (reqPage - 1)); i < ((reqPage * 9) - reqPage); i++) {
			if (await dayInfo[i]) {
				insertToCourseDisplay((currentWorkID), await dayInfo[i])
				currentWorkID++
			}
			setDisplayProperty("courses__plus__container__front", "none")
			setDisplayProperty("courses__plus__container__back", "none")
			setDisplayProperty("plus__container__day", "flex")
		}
        
		if (reqPage == totalPages) {
			setDisplayProperty("courses__plus__container__front", "flex")
		}
	} else {
		for (let i = 0; i < await dayInfo.length; i++) {
			insertToCourseDisplay((i + 1), await dayInfo[i])
		}
		setDisplayProperty("courses__plus__container__front", "flex")
	}
    
	if (reqPage == 1) {
		document.getElementById("plus__container__course__left").style = "background-color: silver"
	} else {
		document.getElementById("plus__container__course__left").style -= "background-color: silver"
	}
    
	if (reqPage == totalPages) {
		document.getElementById("plus__container__course__right").style = "background-color: silver"
	} else {
		document.getElementById("plus__container__course__right").style -= "background-color: silver"
	}
    
	document.getElementById("plus__container__course__left").onclick = function () {
		if (reqPage != 1) {
			updateCourseDisplay(dayName, (reqPage - 1))
		}
	}
    
	document.getElementById("plus__container__course__right").onclick = function () {
		if (reqPage < totalPages) {
			updateCourseDisplay(dayName, (reqPage + 1))
		}
	}
}

async function initCourseDisplay() {
	const dayFullInfo = await getFullDayInfo()
    
	document.getElementById("nav__courseDelete").onclick = function () {
		deleteCurrentDay()
	}
    
	if (await dayFullInfo.length == 0) {
		document.getElementById("course__headline").innerText = "No days configured"
		return
	}
    
	for (let i = 0; i < await dayFullInfo.length; i++) {
		pages.courseStore.push(dayNumberToName(await dayFullInfo[i].day))
	}
    
	updateCourseDisplay(pages.courseStore[0])
    
	if (await dayFullInfo.length > 1) {
		document.getElementById("nav__courseRight").dataset.active = true
		document.getElementById("nav__courseLeft").dataset.active = true
    
		document.getElementById("nav__courseLeft").onclick = async function () {
			pages.courses--
			if (pages.courses < 1) {
				pages.courses = await dayFullInfo.length
			}
			updateCourseDisplay(pages.courseStore[(pages.courses - 1)])
		}
        
		document.getElementById("nav__courseRight").onclick = async function () {
			pages.courses++
			if (pages.courses > await dayFullInfo.length) {
				pages.courses = 1
			}
			updateCourseDisplay(pages.courseStore[(pages.courses - 1)])
		}
	} else if (await dayFullInfo.length == 0) {
		document.getElementById("course__headline").innerText = "No days configured"
	}
    
	document.getElementById("days__container1__button").onclick = function () {
		deleteCourse(store.course1)
	}
    
	document.getElementById("days__container2__button").onclick = function () {
		deleteCourse(store.course2)
	}
    
	document.getElementById("days__container3__button").onclick = function () {
		deleteCourse(store.course3)
	}
    
	document.getElementById("days__container4__button").onclick = function () {
		deleteCourse(store.course4)
	}
    
	document.getElementById("days__container5__button").onclick = function () {
		deleteCourse(store.course5)
	}
    
	document.getElementById("days__container6__button").onclick = function () {
		deleteCourse(store.course6)
	}
    
	document.getElementById("days__container7__button").onclick = function () {
		deleteCourse(store.course7)
	}
    
	document.getElementById("days__container8__button").onclick = function () {
		deleteCourse(store.course8)
	}
    
	document.getElementById("days__container9__button").onclick = function () {
		deleteCourse(store.course9)
	}
}

function setupCoursesPage() {
	initCourseMainButtons()
	initScheduleDisplay()
	initCourseDisplay()
}

function setupSettingsPage() {
	document.getElementById("settings__delete__button").onclick = function () {
		if (document.getElementById("settings__delete__input").value.trim() == "DELETE MY ACCOUNT") {
			deleteAccount()
		} else {
			document.getElementById("settings__delete__button").style.animation = "shake 0.82s cubic-bezier(.36,.07,.19,.97) both"
			setTimeout(function() {
				document.getElementById("settings__delete__button").style.animation -= "shake 0.82s cubic-bezier(.36,.07,.19,.97) both"
			}, timeouts.animation)
		}
	}
    
	document.getElementById("settings__feedback__button").onclick = function () {
		if (document.getElementById("settings__feedback__input").value != "") {
			createFeedback(document.getElementById("settings__feedback__input").value)
			document.getElementById("settings__feedback__input").value = ""
		} else {
			document.getElementById("settings__feedback__button").style.animation = "shake 0.82s cubic-bezier(.36,.07,.19,.97) both"
			setTimeout(function() {
				document.getElementById("settings__feedback__button").style.animation -= "shake 0.82s cubic-bezier(.36,.07,.19,.97) both"
			}, timeouts.animation)
		}
	}
}

function setupRelevantPage() {
	const docTitle = getDocumentTitle()
	switch (docTitle) {
	case "Loop: Dashboard":
		setupDashboardPage()
		break
	case "Loop: Login":
		setupLoginPage()
		break
	case "Loop: Courses":
		setupCoursesPage()
		break
	case "Loop: Settings":
		setupSettingsPage()
		break
	}
}

setupRelevantPage()