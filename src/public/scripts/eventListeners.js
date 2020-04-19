import { time, displayTime } from "./time.js";
import { DOMStrings } from "./DOMStrings.js";

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

export { eventListeners };
