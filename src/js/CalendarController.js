import { MonthView } from "./views/CalendarView";

export class CalendarController {
  constructor(container) {
    this.container = container;
    this.currentDate = new Date();
    this.view = "month";
    this.init();
  }

  init() {
    this.attachEventListeners();
    this.renderView();
  }

  attachEventListeners() {
    const viewButtons = document.querySelector(".header__viewBtns");
    viewButtons.addEventListener("click", (e) => this.handleViewChange(e));
  }

  handleViewChange(event) {
    const target = event.target;
    if (!target.dataset.view) return;

    const buttons = target.parentNode.querySelectorAll("button");
    buttons.forEach((btn) => btn.classList.remove("active"));
    target.classList.add("active");

    this.view = target.dataset.view;
    this.renderView();
  }

  renderView() {
    const { year, month } = {
      year: this.currentDate.getFullYear(),
      month: this.currentDate.getMonth(),
    };

    switch (this.view) {
      case "year":
        console.log("year");
        break;
      case "month":
        new MonthView(this.container).render(month, year);
        break;
      case "week":
        console.log("week");
        break;
      case "day":
        console.log("day");
        break;
    }
  }
}
