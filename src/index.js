import "./styles/main.scss";
import { YearView, MonthView, WeekView, DayView } from "./views/CalendarView";

const viewButtons = document.querySelector(".header__viewBtns");
const calendarSection = document.querySelector(".calendar");

viewButtons.addEventListener("click", (e) => {
  const target = e.target;

  const buttons = viewButtons.querySelectorAll("button");
  buttons.forEach((btn) => btn.classList.remove("active"));
  target.classList.add("active");

  const view = target.dataset.view;
  switchView(view);
});

function getCurrentDate() {
  const currentDate = new Date();
  return {
    month: currentDate.getMonth(),
    year: currentDate.getFullYear(),
  };
}

function switchView(view) {
  switch (view) {
    case "year":
      console.log("year");
      break;

    case "month":
      const { month, year } = getCurrentDate();
      new MonthView(calendarSection).render(month, year);
      break;

    case "week":
      console.log("week");
      break;

    case "day":
      console.log("day");
      break;
  }
}

switchView("month");
