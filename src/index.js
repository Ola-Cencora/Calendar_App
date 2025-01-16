import "./styles/main.scss";
import { CalendarController } from "./js/CalendarViewController";
import { BackendConnectionService } from "./js/services/BackendConnectionService";

const calendarSection = document.querySelector(".calendar__container");

const backendConnectionService = new BackendConnectionService();
const calendarEvents = backendConnectionService.readData();

const calendarView = new CalendarController(calendarSection, calendarEvents);
