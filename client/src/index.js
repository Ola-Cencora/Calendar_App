import "./styles/main.scss";
import { CalendarViewController } from "./js/CalendarViewController";
import { BackendConnectionService } from "./js/backend/BackendConnectionService";

const calendarSection = document.querySelector(".calendar__container");

(async () => {
  try {
    const backendConnectionService = new BackendConnectionService();
    await backendConnectionService.init();

    const calendarView = new CalendarViewController(
      calendarSection,
      backendConnectionService,
      backendConnectionService.events
    );
  } catch (error) {
    console.error("Błąd podczas inicjalizacji aplikacji:", error);
  }
})();
