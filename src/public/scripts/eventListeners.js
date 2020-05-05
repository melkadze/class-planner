import { time, displayTime } from "./time.js";
import { menu } from "./dropdown.js";
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
  dropdown() {
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

export { eventListeners };
