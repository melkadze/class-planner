import { DOMStrings } from "./DOMStrings.js";
import { eventListeners } from "./eventListeners.js";
import { greeting } from "./greeting.js";
import { time, displayTime } from "./time.js";

const page = DOMStrings.header__text.innerText;
if (page == "Dashboard") {
  displayTime.displayMonthAndYear(
    time.getCurrentMonth(),
    time.getCurrentYear()
  );
  displayTime.displayDays(time.getCurrentMonth(), time.getCurrentYear());
  displayTime.displayAnalogTime();
  displayTime.displayDigitalTime();
  eventListeners.calendarNavigation();
  greeting.display();
} else if (page == "Courses") {
  eventListeners.dropdown();
}
