import { time, displayTime } from "./time.js";
import { eventListeners } from "./eventListeners.js";
displayTime.displayMonthAndYear(time.getCurrentMonth(), time.getCurrentYear());
displayTime.displayDays(time.getCurrentMonth(), time.getCurrentYear());
displayTime.displayAnalogTime();
displayTime.displayDigitalTime();
eventListeners.calendarNavigation();
