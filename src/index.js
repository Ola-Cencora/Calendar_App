import "./styles/main.scss";
import { CalendarController } from "./js/CalendarViewController";

const calendarSection = document.querySelector(".calendar__container");

const calendarView = new CalendarController(calendarSection);
