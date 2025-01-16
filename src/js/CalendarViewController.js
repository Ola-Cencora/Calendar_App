import { MonthView } from "./views/CalendarViewService";

export class CalendarController {
  constructor(container, events) {
    this.container = container;
    this.calendarEvents = events;
    this.currentDate = new Date();
    this.view = "month";
    this.init();
  }

  init() {
    this.renderView();
    this.attachEventListeners();
  }

  attachEventListeners() {
    const viewButtons = document.querySelector(".header__viewBtns");
    viewButtons.addEventListener("click", (e) => this.handleViewChange(e));

    const navigationButtons = document.querySelector(".calendar__heading");
    navigationButtons.addEventListener("click", (e) =>
      this.handleNavigation(e)
    );

    document.addEventListener("click", (e) => this.handleToggleModal(e));
  }

  handleToggleModal(event) {
    const target = event.target;

    if (
      target.classList.contains("month__view__grid___day-cell") &&
      !target.classList.contains("empty")
    ) {
      const day = target.textContent;
      const { currentDate, calendarEvents } = this;
      this.viewInstance.showModal(day, currentDate, calendarEvents);
      return;
    }

    if (target.classList.contains("modal")) {
      this.viewInstance.closeModal();
    }
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

  handleNavigation(event) {
    const target = event.target;
    if (!target.dataset.action) return;

    switch (target.dataset.action) {
      case "next":
        this.incrementDate();
        break;
      case "prev":
        this.decrementDate();
        break;
    }

    this.renderView();
  }

  incrementDate() {
    switch (this.view) {
      case "month":
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        break;
      /*case "week":
        this.currentDate.setDate(this.currentDate.getDate() + 7);
        break;
      case "day":
        this.currentDate.setDate(this.currentDate.getDate() + 1);
        break;*/
    }
  }

  decrementDate() {
    switch (this.view) {
      case "month":
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        break;
      /*case "week":
        this.currentDate.setDate(this.currentDate.getDate() - 7);
        break;
      case "day":
        this.currentDate.setDate(this.currentDate.getDate() - 1);
        break;*/
    }
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
        this.viewInstance = new MonthView(this.container);
        this.viewInstance.render(month, year);
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
