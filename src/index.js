import "./styles/main.scss";
import { CalendarController } from "./js/CalendarController";

const calendarSection = document.querySelector(".calendar__container");

const calendarView = new CalendarController(calendarSection);
