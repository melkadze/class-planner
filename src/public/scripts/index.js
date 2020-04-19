import { time, displayTime } from "./time.js";
import { eventListeners } from "./eventListeners.js";
import { greeting } from "./greeting.js";
displayTime.displayMonthAndYear(time.getCurrentMonth(), time.getCurrentYear());
displayTime.displayDays(time.getCurrentMonth(), time.getCurrentYear());
displayTime.displayAnalogTime();
displayTime.displayDigitalTime();
eventListeners.calendarNavigation();
greeting.display();
