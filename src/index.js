import "./styles/main.scss";
import { CalendarViewController } from "./js/CalendarViewController";
import { BackendConnectionService } from "./js/backend/BackendConnectionService";

const calendarSection = document.querySelector(".calendar__container");

const backendConnectionService = new BackendConnectionService();
const calendarEvents = backendConnectionService.readData();

const calendarView = new CalendarViewController(
  calendarSection,
  calendarEvents
);
