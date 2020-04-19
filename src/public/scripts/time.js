import { DOMStrings } from "./DOMStrings.js";
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
  displayCurrentMonthAndYear() {
    let month = time.getCurrentMonth();
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
        breaak;
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
    const year = time.getCurrentYear();
    let calendar__headline = DOMStrings.calendar__headline;
    calendar__headline.innerText = `${month} ${year}`;
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
        `<a class="calendar__days--inactive">${i}</a>`
      );
    }
    for (let i = 1; i <= numberOfDays; i++, functionCounter++) {
      calendar.insertAdjacentHTML(
        "beforeend",
        `<a class="calendar__days">${i}</a>`
      );
      if (i == today) {
        calendar.lastElementChild.classList = "calendar__days--container";
        calendar.lastElementChild.innerText = "";
        calendar.lastElementChild.innerHTML = `<p class="calendar__days calendar__days--today">${i}</p>`;
      }
    }
    for (let i = 1; functionCounter < 35; i++, functionCounter++) {
      calendar.insertAdjacentHTML(
        "beforeend",
        `<a class="calendar__days--inactive">${i}</a>`
      );
    }
  },
  displayAnalogTime() {
    const clock__hour = DOMStrings.clock__hour;
    const clock__minute = DOMStrings.clock__minute;
    const clock__second = DOMStrings.clock__second;
    setInterval(() => {
      let hour = time.getHour() * 30;
      let minute = time.getMinute() * 6;
      let second = time.getSecond() * 6;
      clock__hour.style.transform = `rotateZ(${hour + minute / 12}deg)`;
      clock__minute.style.transform = `rotateZ(${minute}deg)`;
      clock__second.style.transform = `rotateZ(${second}deg)`;
    });
  },
  displayDigitalTime() {
    const alarms__digital = DOMStrings.alarms__digital;
    setInterval(() => {
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
      if (hour < 10) {
        hour = `0${hour}`;
      }
      if (minute < 10) {
        minute = `0${minute}`;
      }
      alarms__digital.innerText = `${hour}:${minute} ${period}`;
    });
  },
};
export { time, displayTime };
